/**
 * Ponto de entrada do servidor FanVerse (`npm start`).
 *
 * Serve a API do catálogo, o build do frontend Vite (`dist/`) em `/` e o site
 * estático legado em `/site/`. A lógica fica em `server/app.js`.
 *
 * Variáveis de ambiente:
 *   PORT                   porta HTTP (padrão 3000)
 *   HOST                   interface (padrão 127.0.0.1; use 0.0.0.0 para expor na rede)
 *   FANVERSE_DATA_PATH     arquivo do catálogo (padrão data/catalogo.json)
 *   FANVERSE_ADMIN_TOKEN   token exigido no PUT /api/catalogo (sem ele, só loopback escreve)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createApp } from './server/app.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const app = createApp({
  dataPath: process.env.FANVERSE_DATA_PATH || path.join(ROOT, 'data', 'catalogo.json'),
  distDir: path.join(ROOT, 'dist'),
  siteDir: path.join(ROOT, 'site'),
  adminToken: process.env.FANVERSE_ADMIN_TOKEN || undefined,
});

app.listen(PORT, HOST, () => {
  console.log(`FanVerse server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});
