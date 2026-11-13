import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { enabledHeroVisuals, heroVisuals, nextHeroId, HERO_ROTATION_MS } from '../lib/home-hero-visuals.ts';
import { startingGoals, startingSystems } from '../lib/home-starting-scope.ts';

test('hero rotation uses only explicitly enabled supported products', () => {
  const products = [
    { id: 'RIS', enabled: false }, { id: 'PACS', enabled: true },
    { id: 'HIS', enabled: true }, { id: 'AI', enabled: true },
  ];
  const options = enabledHeroVisuals(products);
  assert.deepEqual(options.map(item => item.id), ['PACS', 'AI']);
  assert.equal(nextHeroId(options.map(item => item.id), 'PACS'), 'AI');
  assert.equal(nextHeroId(options.map(item => item.id), 'AI'), 'PACS');
  assert.deepEqual(enabledHeroVisuals([]), []);
});

test('hero handles no products, one product and a removed current selection', () => {
  assert.equal(nextHeroId([], 'RIS'), '');
  assert.equal(nextHeroId(['CMS'], 'CMS'), 'CMS');
  assert.equal(nextHeroId(['PACS', 'CMS'], 'RIS'), 'PACS');
  assert.ok(HERO_ROTATION_MS >= 5000);
});

test('every branded hero illustration is local, bilingual and distinct', () => {
  assert.equal(new Set(heroVisuals.map(item => item.image)).size, heroVisuals.length);
  for (const visual of heroVisuals) {
    assert.ok(visual.title.ar && visual.title.en && visual.alt.ar && visual.alt.en);
    assert.ok(existsSync(new URL(`../public${visual.image}`, import.meta.url)), visual.image);
    assert.ok(['radiology', 'medical'].includes(visual.facility));
  }
});

test('scope finder keeps starting scopes within the facility and enabled catalog', () => {
  const products = ['RIS', 'PACS', 'CMS', 'PORTAL', 'AI', 'HIS'].map(id => ({ id, enabled: true }));
  assert.deepEqual(startingSystems(products, 'radiology', 'connected'), ['RIS', 'PACS', 'PORTAL']);
  assert.deepEqual(startingSystems(products, 'medical', 'connected'), ['CMS', 'PORTAL']);
  assert.deepEqual(startingSystems(products, 'medical', 'imaging'), []);
  assert.equal(startingGoals('medical').includes('assistance'), false);
  products.find(product => product.id === 'PACS').enabled = false;
  assert.deepEqual(startingSystems(products, 'radiology', 'imaging'), []);
  assert.deepEqual(startingSystems(products, 'radiology', 'connected'), ['RIS', 'PORTAL']);
});

test('scope finder safely handles empty and unknown selections without mutating products', () => {
  const products = [{ id: 'CMS', enabled: true }, { id: 'CMS', enabled: true }];
  const original = structuredClone(products);
  assert.deepEqual(startingSystems(products, 'medical', 'operations'), ['CMS']);
  assert.deepEqual(products, original);
  assert.deepEqual(startingSystems([], 'medical', 'operations'), []);
  for (const unknown of ['unknown', '__proto__', 'toString']) {
    assert.deepEqual(startingSystems(products, unknown, 'operations'), []);
    assert.deepEqual(startingSystems(products, 'medical', unknown), []);
    assert.deepEqual(startingGoals(unknown), []);
  }
});
