/**
 * Gera site/assets/js/data.js a partir de data/catalogo.json (DEC-006).
 *
 * O site legado roda sem servidor (abre com `python -m http.server`), então não
 * pode buscar a API; ele precisa dos dados num <script>. Antes esse arquivo era
 * copiado à mão e já divergia do JSON. Agora é gerado:
 *
 *   npm run sync:site-data    regrava o arquivo
 *   npm run check:site-data   falha se o arquivo estiver desatualizado (usado nos testes/CI)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { validateCatalog } from '../shared/catalog.js';

export const DATA_FILE = fileURLToPath(new URL('../data/catalogo.json', import.meta.url));
export const SITE_DATA_FILE = fileURLToPath(new URL('../site/assets/js/data.js', import.meta.url));

export function renderSiteData(catalog) {
  const { schemaVersion: _omit, ...data } = catalog;
  return `// ARQUIVO GERADO por scripts/sync-site-data.mjs a partir de data/catalogo.json.
// NÃO EDITE À MÃO: altere o JSON e rode \`npm run sync:site-data\`.
const siteData = ${JSON.stringify(data, null, 2)};

const allBooks = siteData.collections.flatMap((collection) =>
  collection.arcs.flatMap((arc) => arc.books.map((book) => ({ ...book, collectionId: collection.id, collectionTitle: collection.title, arcId: arc.id, arcTitle: arc.title })))
);

const getCollectionById = (id) => siteData.collections.find((collection) => collection.id === id);
const getBookById = (id) => allBooks.find((book) => book.id === id);

window.siteData = siteData;
window.allBooks = allBooks;
`;
}

function main() {
  const catalog = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  const result = validateCatalog(catalog);
  if (!result.ok) {
    console.error('data/catalogo.json não segue o contrato:', result.errors);
    process.exit(1);
  }
  const expected = renderSiteData(catalog);

  if (process.argv.includes('--check')) {
    if (readFileSync(SITE_DATA_FILE, 'utf-8') !== expected) {
      console.error('site/assets/js/data.js está desatualizado. Rode `npm run sync:site-data`.');
      process.exit(1);
    }
    console.log('site/assets/js/data.js está sincronizado com data/catalogo.json.');
    return;
  }
  writeFileSync(SITE_DATA_FILE, expected);
  console.log('site/assets/js/data.js regenerado.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
