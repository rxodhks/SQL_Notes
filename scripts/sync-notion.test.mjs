import test from 'node:test';
import assert from 'node:assert/strict';
import { renderBlock, blockChildrenCache, assertSafeReplacement } from './sync-notion.mjs';

const rich = text => [{plain_text:text}];
for (let level = 1; level <= 4; level++) {
  test(`heading ${level} retains nested text, code and headings`, async () => {
    const id = `heading${level}`;
    blockChildrenCache.set(id, Promise.resolve([
      {id:`text${level}`, type:'paragraph', paragraph:{rich_text:rich('nested body')}},
      {id:`code${level}`, type:'code', code:{rich_text:rich('select * from t;'), language:'sql'}},
      {id:`sub${level}`, type:'heading_4', heading_4:{rich_text:rich('subheading')}}
    ]));
    const result = await renderBlock({id, type:`heading_${level}`, has_children:true, [`heading_${level}`]:{rich_text:rich('title')}}, 'sql/tuning/README.md', {id:'root'}, {imageIndex:0});
    assert.ok(result.startsWith('#'.repeat(level)+' title'));
    assert.ok(result.includes('nested body'));
    assert.ok(result.includes('select * from t;'));
    assert.ok(result.includes('#### subheading'));
  });
}
test('unknown blocks fail even with children', async () => {
  await assert.rejects(renderBlock({id:'unknown',type:'future_block',has_children:true},'',{},{}), /Unsupported/);
});
test('callouts probe children even when the flag is false', async () => {
  blockChildrenCache.set('callout', Promise.resolve([{id:'body', type:'paragraph', paragraph:{rich_text:rich('summary body')}}]));
  const text = await renderBlock({id:'callout',type:'callout',has_children:false,callout:{rich_text:rich('summary')}},'sql/tuning/README.md',{},{});
  assert.ok(text.includes('summary body'));
});
test('large loss blocks publication; additions pass', () => {
  assert.throws(()=>assertSafeReplacement('a'.repeat(1000),'a'.repeat(100),'note'),/shrank/);
  assert.doesNotThrow(()=>assertSafeReplacement('a'.repeat(1000),'a'.repeat(1200),'note'));
});
