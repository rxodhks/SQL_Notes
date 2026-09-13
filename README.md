# SQL_Notes

Notion의 `SQL 노트`를 GitHub Markdown으로 자동 동기화하는 저장소입니다.

## 동기화 대상

- `SQL 기본` → `sql/basic/`
- `SQL 튜닝` → `sql/tuning/`
- 하위 Notion 페이지도 재귀적으로 Markdown 파일로 생성
- Notion 이미지 블록은 `assets/` 아래에 내려받아 상대 경로로 연결

## 자동화

`.github/workflows/notion-sync.yml`이 6시간마다 실행되며, GitHub Actions 화면에서 수동 실행도 할 수 있습니다.

자동화가 동작하려면 이 저장소의 GitHub Actions Secret에 `NOTION_TOKEN`을 등록해야 합니다.

```text
Settings
→ Secrets and variables
→ Actions
→ New repository secret
→ Name: NOTION_TOKEN
→ Secret: Notion Integration token
```

이 토큰을 발급한 Notion Integration에는 `SQL 노트` 페이지와 하위 페이지를 읽을 수 있는 권한이 있어야 합니다.

> `sql/`, `assets/`, `.notion-sync-manifest.json`에 자동 생성되는 파일은 GitHub에서 직접 수정하지 말고 Notion 원본을 수정하세요.
