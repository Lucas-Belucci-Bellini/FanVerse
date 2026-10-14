import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';

import { createApp, requireWriteAccess } from '../server/app.js';
import { DATA_FILE, ROOT, loadCatalog } from './helpers.js';

const silent = { error() {}, warn() {} };

/** Sobe o app numa porta efêmera, com uma cópia do catálogo num diretório temporário. */
async function startServer(options = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'fanverse-'));
  const dataPath = path.join(dir, 'catalogo.json');
  copyFileSync(DATA_FILE, dataPath);
  const app = createApp({ dataPath, siteDir: path.join(ROOT, 'site'), logger: silent, ...options });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base, dir, dataPath,
    close: () => new Promise((resolve) => server.close(() => { rmSync(dir, { recursive: true, force: true }); resolve(); })),
  };
}

/** Requisição crua: `fetch` normaliza `..` no caminho, o que esconderia o ataque. */
function rawGet(base, rawPath) {
  const { hostname, port } = new URL(base);
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname, port, path: rawPath, method: 'GET' }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

const put = (base, body, headers = {}) => fetch(`${base}/api/catalogo`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

describe('API do catálogo', () => {
  let srv;
  before(async () => { srv = await startServer(); });
  after(() => srv.close());
  beforeEach(() => copyFileSync(DATA_FILE, srv.dataPath));

  it('GET /api/health', async () => {
    const res = await fetch(`${srv.base}/api/health`);
    assert.deepEqual(await res.json(), { status: 'ok' });
  });

  it('GET /api/catalogo devolve o catálogo com ETag', async () => {
    const res = await fetch(`${srv.base}/api/catalogo`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('etag'), /^"[0-9a-f]{32}"$/);
    assert.deepEqual(await res.json(), loadCatalog());
  });

  it('GET /api/catalogo/books lista os livros com coleção e arco', async () => {
    const books = await (await fetch(`${srv.base}/api/catalogo/books`)).json();
    assert.equal(books.length, 4);
    assert.equal(books[0].collectionId, 'cronicas-da-baluarte');
    assert.equal(books[0].arcTitle, 'Arco 01 — O Portão de Pedra');
  });

  it('GET /api/catalogo/book/:id e /collection/:id, com 404 em JSON', async () => {
    const book = await fetch(`${srv.base}/api/catalogo/book/sol-01`);
    assert.equal((await book.json()).collectionId, 'fanfic-do-sol');
    const collection = await fetch(`${srv.base}/api/catalogo/collection/fanfic-do-sol`);
    assert.equal((await collection.json()).arcs.length, 1);

    for (const url of ['/api/catalogo/book/nope', '/api/catalogo/collection/nope', '/api/nao-existe']) {
      const res = await fetch(srv.base + url);
      assert.equal(res.status, 404, url);
      assert.equal((await res.json()).error, 'NOT_FOUND', url);
    }
  });

  it('PUT válido grava no arquivo com schemaVersion e devolve ETag novo', async () => {
    const catalog = loadCatalog();
    catalog.collections[0].title = 'Crônicas (editado)';
    const res = await put(srv.base, catalog);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.catalog.schemaVersion, 1);
    const onDisk = JSON.parse(readFileSync(srv.dataPath, 'utf-8'));
    assert.equal(onDisk.collections[0].title, 'Crônicas (editado)');
    assert.equal(onDisk.schemaVersion, 1);
    const get = await fetch(`${srv.base}/api/catalogo`);
    assert.equal(get.headers.get('etag'), res.headers.get('etag'));
  });

  it('PUT inválido responde 400 com detalhes e NÃO altera o arquivo', async () => {
    const before = readFileSync(srv.dataPath, 'utf-8');
    const res = await put(srv.base, { collections: [{ x: 1 }] });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, 'VALIDATION_ERROR');
    assert.ok(body.details.some((d) => d.path === 'collections[0].id'));
    assert.equal(readFileSync(srv.dataPath, 'utf-8'), before);
    assert.equal((await fetch(`${srv.base}/api/catalogo/books`)).status, 200);
  });

  it('JSON malformado responde 400 em JSON, sem stack trace', async () => {
    const res = await put(srv.base, 'not json');
    assert.equal(res.status, 400);
    const text = await res.text();
    assert.equal(JSON.parse(text).error, 'INVALID_JSON');
    assert.doesNotMatch(text, /at JSON\.parse|node_modules|\/home\//);
  });

  it('If-Match desatualizado responde 412 e não grava', async () => {
    const stale = (await fetch(`${srv.base}/api/catalogo`)).headers.get('etag');
    const first = loadCatalog();
    first.author.name = 'Primeira edição';
    assert.equal((await put(srv.base, first, { 'If-Match': stale })).status, 200);

    const second = loadCatalog();
    second.author.name = 'Edição concorrente';
    const res = await put(srv.base, second, { 'If-Match': stale });
    assert.equal(res.status, 412);
    assert.equal((await res.json()).error, 'PRECONDITION_FAILED');
    assert.equal(JSON.parse(readFileSync(srv.dataPath, 'utf-8')).author.name, 'Primeira edição');
  });

  it('PUTs simultâneos não corrompem o arquivo', async () => {
    const results = await Promise.all(Array.from({ length: 8 }, (_, i) => {
      const catalog = loadCatalog();
      catalog.author.name = `Autor ${i}`;
      return put(srv.base, catalog);
    }));
    assert.ok(results.every((res) => res.status === 200));
    const onDisk = JSON.parse(readFileSync(srv.dataPath, 'utf-8'));
    assert.match(onDisk.author.name, /^Autor \d$/);
  });

  it('arquivo corrompido vira 500 PERSISTENCE_ERROR, sem detalhes internos', async () => {
    writeFileSync(srv.dataPath, '{ quebrado');
    const res = await fetch(`${srv.base}/api/catalogo`);
    assert.equal(res.status, 500);
    const body = await res.json();
    assert.equal(body.error, 'PERSISTENCE_ERROR');
    assert.doesNotMatch(JSON.stringify(body), /fanverse-|Unexpected token/);
  });
});

describe('arquivos estáticos e travessia de caminho', () => {
  let srv;
  before(async () => { srv = await startServer(); });
  after(() => srv.close());

  it('não serve arquivos fora das pastas públicas (achado S-01)', async () => {
    for (const attack of ['/../server.js', '/../../../../etc/hostname', '/site/../server.js',
      '/site/../../package.json', '/..%2fserver.js', '/site/..%2f..%2fserver.js', '/../data/catalogo.json']) {
      const res = await rawGet(srv.base, attack);
      assert.notEqual(res.status, 200, attack);
      assert.doesNotMatch(res.body, /require\(|express|"author"/, attack);
    }
  });

  it('não expõe mais o código-fonte em /src', async () => {
    for (const url of ['/src/main.js', '/src/livros/Livro.java', '/server.js', '/package.json']) {
      assert.equal((await fetch(srv.base + url)).status, 404, url);
    }
  });

  it('serve o site legado em /site/ e redireciona links antigos da raiz', async () => {
    const page = await fetch(`${srv.base}/site/catalogo.html`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /data-page="catalogo"/);

    const old = await fetch(`${srv.base}/livro.html?id=sol-01`, { redirect: 'manual' });
    assert.equal(old.status, 301);
    assert.equal(old.headers.get('location'), '/site/livro.html?id=sol-01');
  });

  it('sem build do Vite, a raiz redireciona para o site legado', async () => {
    const res = await fetch(`${srv.base}/`, { redirect: 'manual' });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/site/');
  });

  it('com build do Vite, a raiz serve dist/index.html', async () => {
    const distDir = path.join(srv.dir, 'dist');
    mkdirSync(distDir);
    writeFileSync(path.join(distDir, 'index.html'), '<div id="app">build de teste</div>');
    const withDist = await startServer({ distDir });
    try {
      const res = await fetch(`${withDist.base}/`);
      assert.equal(res.status, 200);
      assert.match(await res.text(), /build de teste/);
    } finally {
      await withDist.close();
    }
  });
});

describe('autorização de escrita', () => {
  const run = (middleware, req) => new Promise((resolve) => middleware(req, {}, resolve));
  const request = ({ remoteAddress = '127.0.0.1', authorization } = {}) => ({
    socket: { remoteAddress },
    get: (name) => (name.toLowerCase() === 'authorization' ? authorization : undefined),
  });

  it('sem token: aceita loopback e recusa rede externa com 403', async () => {
    const guard = requireWriteAccess(undefined);
    assert.equal(await run(guard, request({ remoteAddress: '127.0.0.1' })), undefined);
    assert.equal(await run(guard, request({ remoteAddress: '::1' })), undefined);
    const err = await run(guard, request({ remoteAddress: '203.0.113.7' }));
    assert.equal(err.status, 403);
  });

  it('com token: exige Bearer correto mesmo em loopback', async () => {
    const guard = requireWriteAccess('segredo-de-teste');
    assert.equal((await run(guard, request())).status, 401);
    assert.equal((await run(guard, request({ authorization: 'Bearer errado' }))).status, 401);
    assert.equal(await run(guard, request({ remoteAddress: '203.0.113.7', authorization: 'Bearer segredo-de-teste' })), undefined);
  });

  it('PUT sem o token configurado responde 401 de ponta a ponta', async () => {
    const srv = await startServer({ adminToken: 'segredo-de-teste' });
    try {
      assert.equal((await put(srv.base, loadCatalog())).status, 401);
      assert.equal((await put(srv.base, loadCatalog(), { Authorization: 'Bearer segredo-de-teste' })).status, 200);
    } finally {
      await srv.close();
    }
  });
});
