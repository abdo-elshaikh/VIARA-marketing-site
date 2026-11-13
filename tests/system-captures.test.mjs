import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { systemCaptures, getSystemCaptures } from '../lib/system-captures.ts';

test('published interface captures have complete captions and existing local assets', () => {
  for (const [system, captures] of Object.entries(systemCaptures)) {
    assert.equal(new Set(captures.map(item => item.id)).size, captures.length, system);
    assert.equal(new Set(captures.map(item => item.image)).size, captures.length, system);
    for (const locale of ['ar', 'en']) for (const capture of getSystemCaptures(system, locale)) {
      assert.ok(capture.title[locale] && capture.description[locale]);
      assert.ok(!capture.title[locale].includes('???'));
      assert.ok(capture.width > 800 && capture.height > 500);
      for (const asset of [capture.image, capture.thumbnail, capture.original].filter(Boolean)) assert.ok(existsSync(new URL('../public' + asset, import.meta.url)), asset);
    }
  }
});

test('fresh portal screenshots follow page language without mutating the capture registry', () => {
  const original = structuredClone(systemCaptures.PORTAL);
  const arabic = getSystemCaptures('PORTAL', 'ar');
  const english = getSystemCaptures('PORTAL', 'en');
  assert.equal(arabic.length, 4);
  for (let index = 0; index < arabic.length; index++) {
    assert.match(arabic[index].image, /-ar\.webp$/);
    assert.match(english[index].image, /-en\.webp$/);
    assert.equal(arabic[index].capturedAt, '2026-10-27');
    assert.equal(arabic[index].id, english[index].id);
  }
  assert.deepEqual(systemCaptures.PORTAL, original);
  assert.deepEqual(getSystemCaptures('UNKNOWN', 'ar'), []);
});
