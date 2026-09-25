import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const DATA_FILE = fileURLToPath(new URL('../data/catalogo.json', import.meta.url));

/** Cópia nova do catálogo real versionado (cada teste pode mutar à vontade). */
export const loadCatalog = () => JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
