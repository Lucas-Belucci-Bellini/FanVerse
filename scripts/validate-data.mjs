/** Valida data/catalogo.json contra o contrato (`npm run validate:data`). */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { validateCatalog } from '../shared/catalog.js';

const file = process.argv[2] ?? fileURLToPath(new URL('../data/catalogo.json', import.meta.url));

let catalog;
try {
  catalog = JSON.parse(readFileSync(file, 'utf-8'));
} catch (error) {
  console.error(`Não foi possível ler ${file}: ${error.message}`);
  process.exit(1);
}

const { ok, errors } = validateCatalog(catalog);
if (!ok) {
  console.error(`${file} tem ${errors.length} erro(s):`);
  for (const { path, message } of errors) console.error(`  - ${path || '(raiz)'}: ${message}`);
  process.exit(1);
}
console.log(`${file} segue o contrato do catálogo.`);
