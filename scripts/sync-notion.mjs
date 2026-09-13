import { Client } from "@notionhq/client";
import fs from "node:fs/promises";
import path from "node:path";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const SYNC_DATA_SOURCE_ID =
  process.env.NOTION_SYNC_DATA_SOURCE_ID ??
  "f7de0b48-16d6-4321-9402-56a9391166d0";
const MANIFEST_PATH = ".notion-sync-manifest.json";
const MIN_NOTION_INTERVAL_MS = 420;
const MAX_RATE_LIMIT_RETRIES = 8;
const DELETE_STALE_FILES = process.env.NOTION_SYNC_DELETE_STALE === "true";

if (!NOTION_TOKEN) {
  throw new Error(
    "NOTION_TOKEN is missing. Add it as a GitHub Actions repository secret.",
  );
}

const notion = new Client({
  auth: NOTION_TOKEN,
  notionVersion: "2026-03-11",
});

const generatedFiles = new Set();
const pageById = new Map();
const blockChildrenCache = new Map();
let lastNotionRequestAt = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function canonicalId(id) {
  return String(id ?? "").replaceAll("-", "").toLowerCase();
}

function isRateLimitError(error) {
  return (
    error?.code === "rate_limited" ||
    error?.status === 429 ||
    error?.statusCode === 429 ||
    error?.body?.code === "rate_limited"
  );
}

async function notionRequest(label, request) {
  for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
    const waitFor = Math.max(
      0,
      MIN_NOTION_INTERVAL_MS - (Date.now() - lastNotionRequestAt),
    );
    if (waitFor > 0) await sleep(waitFor);
    lastNotionRequestAt = Date.now();

    try {
      return await request();
    } catch (error) {
      if (!isRateLimitError(error) || attempt === MAX_RATE_LIMIT_RETRIES) {
        throw error;
      }

      const retryAfterSeconds = Number(
        error?.headers?.["retry-after"] ?? error?.headers?.get?.("retry-after"),
      );
      const backoff = Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds * 1000
        : Math.min(1500 * 2 ** attempt, 30000);

      console.warn(
        `${label}: Notion rate limit. Retrying in ${Math.ceil(backoff / 1000)}s (attempt ${attempt + 1}/${MAX_RATE_LIMIT_RETRIES}).`,
      );
      await sleep(backoff);
    }
  }

  throw new Error(`${label}: retry loop ended unexpectedly.`);
}

function propertyText(property) {
  if (!property) return "";
  if (property.type === "title") {
    return (property.title ?? []).map((item) => item.plain_text ?? "").join("");
  }
  if (property.type === "rich_text") {
    return (property.rich_text ?? [])
      .map((item) => item.plain_text ?? "")
      .join("");
  }
  return "";
}

function pageTitle(page, fallback = "Untitled") {
  if (!page || page.object !== "page" || !("properties" in page)) return fallback;
  for (const property of Object.values(page.properties)) {
    if (property?.type === "title") {
      const title = propertyText(property);
      if (title) return title;
    }
  }
  return fallback;
}

function propertyUrl(property) {
  return property?.type === "url" ? property.url ?? "" : "";
}

function extractPageId(value) {
  if (!value) return null;
  return (
    String(value).match(/[0-9a-f]{32}/i)?.[0] ??
    String(value).match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    )?.[0] ??
    null
  );
}

function safeRepoPath(value) {
  const normalized = path.posix.normalize(String(value ?? "").replaceAll("\\", "/"));
  if (
    !normalized ||
    normalized === "." ||
    normalized.startsWith("/") ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`Unsafe GitHub Path: ${value}`);
  }
  return normalized;
}

function slugify(value, fallback) {
  const cleaned = String(value ?? "")
    .normalize("NFKC")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/[#[\]()%]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.\-]+|[.\-]+$/g, "")
    .toLowerCase();
  return cleaned || fallback;
}

async function queryPublishedRoots() {
  const rows = [];
  let startCursor;

  do {
    const response = await notionRequest("Query sync database", () =>
      notion.dataSources.query({
        data_source_id: SYNC_DATA_SOURCE_ID,
        filter: {
          property: "게시",
          checkbox: { equals: true },
        },
        ...(startCursor ? { start_cursor: startCursor } : {}),
      }),
    );

    rows.push(...response.results);
    startCursor = response.has_more ? response.next_cursor : undefined;
  } while (startCursor);

  const roots = rows
    .map((row) => {
      if (row.object !== "page" || !("properties" in row)) return null;

      const name = propertyText(row.properties["이름"]);
      const pageUrl = propertyUrl(row.properties["원본 페이지"]);
      const pageId = extractPageId(pageUrl);
      const outputPath = propertyText(row.properties["GitHub Path"]);

      if (!pageId || !outputPath) {
        console.warn(
          `Skipping sync row '${name || row.id}': 원본 페이지 or GitHub Path is missing.`,
        );
        return null;
      }

      return {
        name: name || "Untitled",
        pageId,
        filePath: safeRepoPath(outputPath),
      };
    })
    .filter(Boolean);

  if (roots.length === 0) {
    throw new Error(
      "No published rows were found in the Notion 'GitHub 동기화' database.",
    );
  }

  return roots;
}

async function listAccessiblePages() {
  const pages = [];
  let startCursor;

  do {
    const response = await notionRequest("Search accessible Notion pages", () =>
      notion.search({
        filter: { property: "object", value: "page" },
        page_size: 100,
        ...(startCursor ? { start_cursor: startCursor } : {}),
      }),
    );

    for (const item of response.results) {
      if (item.object === "page") pages.push(item);
    }
    startCursor = response.has_more ? response.next_cursor : undefined;
  } while (startCursor);

  return pages;
}

function buildPageIndexes(pages) {
  const pageIndex = new Map();
  const childrenByParent = new Map();

  for (const page of pages) {
    const pageKey = canonicalId(page.id);
    pageIndex.set(pageKey, page);

    if (page.parent?.type !== "page_id") continue;
    const parentKey = canonicalId(page.parent.page_id);
    const children = childrenByParent.get(parentKey) ?? [];
    children.push(page);
    childrenByParent.set(parentKey, children);
  }

  for (const children of childrenByParent.values()) {
    children.sort((a, b) => pageTitle(a).localeCompare(pageTitle(b), "ko"));
  }

  return { pageIndex, childrenByParent };
}

async function ensureRootPages(roots, pageIndex) {
  for (const root of roots) {
    const key = canonicalId(root.pageId);
    if (pageIndex.has(key)) continue;

    const page = await notionRequest(`Read root page ${root.pageId}`, () =>
      notion.pages.retrieve({ page_id: root.pageId }),
    );
    if (page.object === "page") pageIndex.set(key, page);
  }
}

async function listChildren(blockId) {
  const key = canonicalId(blockId);
  if (blockChildrenCache.has(key)) return blockChildrenCache.get(key);

  const pending = (async () => {
    const results = [];
    let startCursor;

    do {
      const response = await notionRequest(`Read block ${blockId}`, () =>
        notion.blocks.children.list({
          block_id: blockId,
          page_size: 100,
          ...(startCursor ? { start_cursor: startCursor } : {}),
        }),
      );
      results.push(...response.results);
      startCursor = response.has_more ? response.next_cursor : undefined;
    } while (startCursor);

    return results;
  })();

  blockChildrenCache.set(key, pending);
  try {
    return await pending;
  } catch (error) {
    blockChildrenCache.delete(key);
    throw error;
  }
}

async function discoverChildPageBlocks(blockId) {
  const blocks = await listChildren(blockId);
  const found = [];

  for (const block of blocks) {
    if (!("type" in block)) continue;

    if (block.type === "child_page") {
      found.push({
        id: block.id,
        title: block.child_page?.title ?? "Untitled",
      });
      continue;
    }

    if (block.has_children) {
      found.push(...(await discoverChildPageBlocks(block.id)));
    }
  }

  return found;
}

function childBaseDir(filePath) {
  if (path.posix.basename(filePath).toLowerCase() === "readme.md") {
    return path.posix.dirname(filePath);
  }
  return filePath.replace(/\.md$/i, "");
}

async function buildPageTree(
  pageId,
  filePath,
  titleHint,
  pageIndex,
  childrenByParent,
  ancestry = new Set(),
) {
  const idKey = canonicalId(pageId);
  if (ancestry.has(idKey)) {
    throw new Error(`Cycle detected while traversing Notion page ${pageId}`);
  }

  const page = pageIndex.get(idKey);
  const title = pageTitle(page, titleHint || "Untitled");
  const node = { id: pageId, title, filePath, children: [] };
  pageById.set(idKey, node);

  const nextAncestry = new Set(ancestry);
  nextAncestry.add(idKey);
  const baseDir = childBaseDir(filePath);
  const usedSlugs = new Set();
  const childCandidates = new Map();

  for (const childPage of childrenByParent.get(idKey) ?? []) {
    childCandidates.set(canonicalId(childPage.id), {
      id: childPage.id,
      title: pageTitle(childPage),
    });
  }

  for (const child of await discoverChildPageBlocks(pageId)) {
    const childKey = canonicalId(child.id);
    if (!childCandidates.has(childKey)) {
      childCandidates.set(childKey, child);
    }
  }

  const children = [...childCandidates.values()].sort((a, b) =>
    a.title.localeCompare(b.title, "ko"),
  );

  for (const child of children) {
    const childKey = canonicalId(child.id);
    let slug = slugify(child.title, childKey.slice(0, 8));
    if (usedSlugs.has(slug)) slug = `${slug}-${childKey.slice(0, 6)}`;
    usedSlugs.add(slug);

    const childFilePath = safeRepoPath(path.posix.join(baseDir, `${slug}.md`));
    node.children.push(
      await buildPageTree(
        child.id,
        childFilePath,
        child.title,
        pageIndex,
        childrenByParent,
        nextAncestry,
      ),
    );
  }

  return node;
}

function escapeInline(text) {
  return String(text ?? "").replaceAll("\\", "\\\\").replaceAll("|", "\\|");
}

function richTextToMarkdown(items = []) {
  return items
    .map((item) => {
      let text = item.plain_text ?? "";
      if (!text) return "";

      if (item.type === "equation" && item.equation?.expression) {
        text = `$${item.equation.expression}$`;
      } else {
        text = escapeInline(text);
      }

      if (item.href) text = `[${text}](${item.href})`;

      const annotations = item.annotations ?? {};
      if (annotations.code) {
        const fence = text.includes("`") ? "``" : "`";
        text = `${fence}${text}${fence}`;
      }
      if (annotations.bold) text = `**${text}**`;
      if (annotations.italic) text = `*${text}*`;
      if (annotations.strikethrough) text = `~~${text}~~`;
      return text;
    })
    .join("");
}

function plainRichText(items = []) {
  return items.map((item) => item.plain_text ?? "").join("");
}

function indentMarkdown(markdown, spaces = 2) {
  const prefix = " ".repeat(spaces);
  return markdown
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : line))
    .join("\n");
}

function relativeLink(fromFile, toFile) {
  const relative = path.posix.relative(path.posix.dirname(fromFile), toFile) || ".";
  return encodeURI(relative);
}

function mimeExtension(contentType, sourceUrl) {
  const type = String(contentType ?? "").split(";")[0].trim().toLowerCase();
  const map = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };
  if (map[type]) return map[type];

  try {
    const ext = path.posix.extname(new URL(sourceUrl).pathname).toLowerCase();
    if (/^\.[a-z0-9]{1,6}$/.test(ext)) return ext;
  } catch {
    // Use generic extension below.
  }
  return ".bin";
}

async function downloadImage(sourceUrl, pageId, index, caption) {
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const extension = mimeExtension(response.headers.get("content-type"), sourceUrl);
    const assetName = `${String(index).padStart(3, "0")}-${slugify(
      caption || "image",
      "image",
    )}${extension}`;
    const assetPath = safeRepoPath(
      path.posix.join("assets", canonicalId(pageId), assetName),
    );

    await fs.mkdir(path.dirname(assetPath), { recursive: true });
    await fs.writeFile(assetPath, Buffer.from(await response.arrayBuffer()));
    generatedFiles.add(assetPath);
    return assetPath;
  } catch (error) {
    console.warn(`Image download failed; keeping original URL: ${error.message}`);
    return null;
  }
}

function fileLikeUrl(value) {
  if (!value) return "";
  if (value.type === "file") return value.file?.url ?? "";
  if (value.type === "external") return value.external?.url ?? "";
  return "";
}

async function renderNestedChildren(block, currentFile, pageNode, state) {
  if (!block.has_children) return "";
  return renderBlocks(await listChildren(block.id), currentFile, pageNode, state);
}

async function renderBlock(block, currentFile, pageNode, state) {
  if (!("type" in block)) return "";
  const value = block[block.type];

  switch (block.type) {
    case "paragraph": {
      const own = richTextToMarkdown(value.rich_text);
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return [own, nested].filter(Boolean).join("\n\n");
    }
    case "heading_1":
      return `# ${richTextToMarkdown(value.rich_text)}`;
    case "heading_2":
      return `## ${richTextToMarkdown(value.rich_text)}`;
    case "heading_3":
      return `### ${richTextToMarkdown(value.rich_text)}`;
    case "heading_4":
      return `#### ${richTextToMarkdown(value.rich_text)}`;
    case "bulleted_list_item": {
      const own = `- ${richTextToMarkdown(value.rich_text)}`;
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return nested ? `${own}\n${indentMarkdown(nested)}` : own;
    }
    case "numbered_list_item": {
      const own = `1. ${richTextToMarkdown(value.rich_text)}`;
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return nested ? `${own}\n${indentMarkdown(nested)}` : own;
    }
    case "to_do": {
      const own = `- [${value.checked ? "x" : " "}] ${richTextToMarkdown(value.rich_text)}`;
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return nested ? `${own}\n${indentMarkdown(nested)}` : own;
    }
    case "toggle": {
      const summary = richTextToMarkdown(value.rich_text) || "Details";
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return `<details>\n<summary>${summary}</summary>\n\n${nested}\n\n</details>`;
    }
    case "quote": {
      const own = richTextToMarkdown(value.rich_text);
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return [own, nested]
        .filter(Boolean)
        .join("\n\n")
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    }
    case "callout": {
      const icon = value.icon?.type === "emoji" ? `${value.icon.emoji} ` : "";
      const own = `${icon}${richTextToMarkdown(value.rich_text)}`;
      const nested = await renderNestedChildren(block, currentFile, pageNode, state);
      return [own, nested]
        .filter(Boolean)
        .join("\n\n")
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    }
    case "code": {
      const code = plainRichText(value.rich_text);
      const language = value.language && value.language !== "plain text" ? value.language : "";
      const fence = code.includes("```") ? "````" : "```";
      return `${fence}${language}\n${code}\n${fence}`;
    }
    case "equation":
      return `$$\n${value.expression ?? ""}\n$$`;
    case "divider":
      return "---";
    case "image": {
      const sourceUrl = fileLikeUrl(value);
      const caption = plainRichText(value.caption) || "Notion image";
      if (!sourceUrl) return "";

      state.imageIndex += 1;
      const localAsset = await downloadImage(
        sourceUrl,
        pageNode.id,
        state.imageIndex,
        caption,
      );
      const target = localAsset ? relativeLink(currentFile, localAsset) : sourceUrl;
      return `![${escapeInline(caption)}](${target})`;
    }
    case "bookmark": {
      const caption = richTextToMarkdown(value.caption) || value.url;
      return `[${caption}](${value.url})`;
    }
    case "link_preview":
    case "embed":
      return value.url ? `[${value.url}](${value.url})` : "";
    case "video":
    case "audio":
    case "pdf":
    case "file": {
      const sourceUrl = fileLikeUrl(value);
      const caption = plainRichText(value.caption) || block.type.toUpperCase();
      return sourceUrl ? `[${escapeInline(caption)}](${sourceUrl})` : "";
    }
    case "child_page": {
      const target = pageById.get(canonicalId(block.id));
      if (!target) return `- ${value.title ?? "Untitled"}`;
      return `- [${escapeInline(target.title)}](${relativeLink(currentFile, target.filePath)})`;
    }
    case "table": {
      const rows = (await listChildren(block.id)).filter(
        (row) => row.type === "table_row",
      );
      if (rows.length === 0) return "";

      const renderedRows = rows.map((row) =>
        row.table_row.cells.map((cell) => richTextToMarkdown(cell)),
      );
      const width = Math.max(...renderedRows.map((row) => row.length));
      const normalize = (row) => [
        ...row,
        ...Array(Math.max(0, width - row.length)).fill(""),
      ];
      const lines = [
        `| ${normalize(renderedRows[0]).join(" | ")} |`,
        `| ${Array(width).fill("---").join(" | ")} |`,
      ];
      for (const row of renderedRows.slice(1)) {
        lines.push(`| ${normalize(row).join(" | ")} |`);
      }
      return lines.join("\n");
    }
    case "column_list":
    case "column":
    case "synced_block":
    case "template":
      return renderNestedChildren(block, currentFile, pageNode, state);
    case "table_of_contents":
      return "";
    case "child_database":
      return `> Notion child database **${escapeInline(value.title ?? "Database")}** is not exported.`;
    default: {
      if (block.has_children) {
        return renderNestedChildren(block, currentFile, pageNode, state);
      }
      console.warn(`Unsupported Notion block type: ${block.type}`);
      return "";
    }
  }
}

async function renderBlocks(blocks, currentFile, pageNode, state) {
  const parts = [];
  for (const block of blocks) {
    const rendered = await renderBlock(block, currentFile, pageNode, state);
    if (rendered?.trim()) parts.push(rendered.trimEnd());
  }
  return parts.join("\n\n");
}

async function renderPage(pageNode) {
  const blocks = await listChildren(pageNode.id);
  const state = { imageIndex: 0 };
  const body = await renderBlocks(blocks, pageNode.filePath, pageNode, state);
  const header = [
    "<!-- AUTO-GENERATED FROM NOTION. EDIT THE NOTION PAGE, NOT THIS FILE. -->",
    "",
    `# ${pageNode.title}`,
  ].join("\n");

  await fs.mkdir(path.dirname(pageNode.filePath), { recursive: true });
  await fs.writeFile(
    pageNode.filePath,
    body ? `${header}\n\n${body}\n` : `${header}\n`,
    "utf8",
  );
  generatedFiles.add(pageNode.filePath);

  for (const child of pageNode.children) {
    await renderPage(child);
  }
}

async function readPreviousManifestFiles() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(raw);
    return new Set((manifest.files ?? []).map(safeRepoPath));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not read old sync manifest: ${error.message}`);
    }
    return new Set();
  }
}

async function removeStaleGeneratedFiles(previousFiles) {
  if (!DELETE_STALE_FILES) {
    console.log("Stale-file deletion is disabled for safety.");
    return;
  }

  for (const file of previousFiles) {
    if (generatedFiles.has(file)) continue;
    try {
      await fs.rm(file, { force: true });
    } catch (error) {
      console.warn(`Could not remove stale generated file '${file}': ${error.message}`);
    }
  }
}

async function writeManifest() {
  const manifest = {
    dataSourceId: SYNC_DATA_SOURCE_ID,
    files: [...generatedFiles].sort(),
  };
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function main() {
  console.log("Reading published roots from Notion...");
  const previousFiles = await readPreviousManifestFiles();
  const roots = await queryPublishedRoots();

  console.log("Indexing pages visible to the Notion integration...");
  const accessiblePages = await listAccessiblePages();
  const { pageIndex, childrenByParent } = buildPageIndexes(accessiblePages);
  await ensureRootPages(roots, pageIndex);

  const rootNodes = [];
  for (const root of roots) {
    console.log(`Discovering: ${root.name} -> ${root.filePath}`);
    rootNodes.push(
      await buildPageTree(
        root.pageId,
        root.filePath,
        root.name,
        pageIndex,
        childrenByParent,
      ),
    );
  }

  console.log(`Discovered ${pageById.size} Notion page(s) under published roots.`);

  for (const node of rootNodes) {
    console.log(`Rendering: ${node.title}`);
    await renderPage(node);
  }

  await removeStaleGeneratedFiles(previousFiles);
  await writeManifest();
  console.log(`Sync complete. Generated ${generatedFiles.size} file(s).`);
}

main().catch((error) => {
  console.error("Notion sync failed. No commit will be created.");
  console.error(error);
  process.exitCode = 1;
});