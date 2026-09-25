import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { it } from 'node:test';
import vm from 'node:vm';

import { DATA_FILE, SITE_DATA_FILE, renderSiteData } from '../scripts/sync-site-data.mjs';

it('site/assets/js/data.js é o gerado a partir de data/catalogo.json (rode `npm run sync:site-data`)', () => {
  const catalog = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  assert.equal(readFileSync(SITE_DATA_FILE, 'utf-8'), renderSiteData(catalog));
});

it('o arquivo gerado expõe siteData/allBooks como o site legado espera', () => {
  const window = {};
  vm.runInNewContext(readFileSync(SITE_DATA_FILE, 'utf-8'), { window });
  assert.equal(window.allBooks.length, 4);
  assert.equal(window.allBooks[0].collectionTitle, 'Crônicas da Baluarte');
  assert.equal(window.siteData.author.name, 'Lucas Belucci Bellini');
});
