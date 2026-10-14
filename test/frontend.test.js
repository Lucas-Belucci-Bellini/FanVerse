import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { LEGACY_STORAGE_KEY, STORAGE_KEY, createCatalogStore } from '../src/app/catalog-store.js';
import { esc, renderApp, safeImg } from '../src/app/views.js';
import { loadCatalog } from './helpers.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    dump: () => Object.fromEntries(data),
  };
}

const json = (body, { status = 200, etag = '"v1"' } = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', etag },
});

/** fetch falso que registra as chamadas; `routes` mapeia "MÉTODO" → função. */
function fakeFetch(routes) {
  const calls = [];
  const fn = async (url, init = {}) => {
    const method = init.method ?? 'GET';
    calls.push({ url, method, headers: init.headers ?? {}, body: init.body });
    const handler = routes[method];
    if (!handler) throw new TypeError('network down');
    return handler(init);
  };
  fn.calls = calls;
  return fn;
}

const serverCatalog = () => loadCatalog();
const bundledCatalog = { author: { name: 'Embutido' }, collections: [] };

describe('catalog-store: carregamento', () => {
  it('usa a API quando disponível e guarda cache com o ETag', async () => {
    const storage = memoryStorage();
    const store = createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage, bundledCatalog });
    const state = await store.load();
    assert.equal(state.origin, 'api');
    assert.equal(state.baseEtag, '"v1"');
    assert.equal(JSON.parse(storage.dump()[STORAGE_KEY]).pendingSync, false);
  });

  it('cache antigo NÃO tem mais prioridade sobre o servidor (antes ficava preso ao localStorage)', async () => {
    const stale = serverCatalog();
    stale.collections[0].title = 'Cópia velha';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ catalog: stale, pendingSync: false }) });
    const store = createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage, bundledCatalog });
    const state = await store.load();
    assert.equal(state.catalog.collections[0].title, 'Crônicas da Baluarte');
  });

  it('alterações pendentes têm prioridade e nunca são descartadas em silêncio', async () => {
    const local = serverCatalog();
    local.collections[0].title = 'Editado offline';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ catalog: local, pendingSync: true, baseEtag: '"v0"' }) });
    const store = createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage, bundledCatalog });
    const state = await store.load();
    assert.deepEqual([state.origin, state.pendingSync, state.apiAvailable, state.baseEtag], ['local', true, true, '"v0"']);
    assert.equal(state.catalog.collections[0].title, 'Editado offline');
  });

  it('sem API usa o cache e, sem cache, o catálogo embutido no build', async () => {
    const offline = fakeFetch({});
    const withCache = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ catalog: serverCatalog(), pendingSync: false }) });
    assert.equal((await createCatalogStore({ fetch: offline, storage: withCache, bundledCatalog }).load()).origin, 'cache');
    const empty = await createCatalogStore({ fetch: offline, storage: memoryStorage(), bundledCatalog }).load();
    assert.equal(empty.origin, 'bundled');
    assert.equal(empty.catalog.author.name, 'Embutido');
  });

  it('ignora HTML com status 200 (servidor estático sem API)', async () => {
    const html = fakeFetch({ GET: () => new Response('<!doctype html>', { headers: { 'content-type': 'text/html' } }) });
    const state = await createCatalogStore({ fetch: html, storage: memoryStorage(), bundledCatalog }).load();
    assert.equal(state.origin, 'bundled');
  });

  it('ignora cache local corrompido ou fora do contrato', async () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{not json' });
    const state = await createCatalogStore({ fetch: fakeFetch({}), storage, bundledCatalog }).load();
    assert.equal(state.origin, 'bundled');
  });

  it('funciona sem localStorage (navegador bloqueando)', async () => {
    const state = await createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage: null, bundledCatalog }).load();
    assert.equal(state.origin, 'api');
  });

  it('migra a chave antiga: igual ao servidor → descarta; diferente → pendente', async () => {
    const same = memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(serverCatalog()) });
    const s1 = await createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage: same, bundledCatalog }).load();
    assert.equal(s1.origin, 'api');
    assert.equal(same.getItem(LEGACY_STORAGE_KEY), null);

    const edited = serverCatalog();
    edited.author.name = 'Editado na versão antiga';
    const diff = memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(edited) });
    const s2 = await createCatalogStore({ fetch: fakeFetch({ GET: () => json(serverCatalog()) }), storage: diff, bundledCatalog }).load();
    assert.deepEqual([s2.origin, s2.pendingSync, s2.baseEtag], ['local', true, null]);
    assert.equal(s2.catalog.author.name, 'Editado na versão antiga');
  });
});

describe('catalog-store: gravação', () => {
  it('envia If-Match e marca como sincronizado quando a API aceita', async () => {
    const storage = memoryStorage();
    const fetch = fakeFetch({ PUT: (init) => json({ catalog: JSON.parse(init.body) }, { etag: '"v2"' }) });
    const result = await createCatalogStore({ fetch, storage, bundledCatalog }).save(serverCatalog(), { baseEtag: '"v1"' });
    assert.equal(result.status, 'synced');
    assert.equal(result.baseEtag, '"v2"');
    assert.equal(fetch.calls[0].headers['If-Match'], '"v1"');
    assert.equal(JSON.parse(storage.dump()[STORAGE_KEY]).pendingSync, false);
  });

  it('sem rede, guarda localmente como pendente', async () => {
    const storage = memoryStorage();
    const result = await createCatalogStore({ fetch: fakeFetch({}), storage, bundledCatalog }).save(serverCatalog());
    assert.equal(result.status, 'local');
    assert.equal(JSON.parse(storage.dump()[STORAGE_KEY]).pendingSync, true);
  });

  it('traduz 412, 401/403 e 400 em estados distintos', async () => {
    const cases = [[412, 'conflict'], [401, 'forbidden'], [403, 'forbidden'], [400, 'invalid'], [500, 'local']];
    for (const [status, expected] of cases) {
      const fetch = fakeFetch({ PUT: () => json({ error: 'X', message: 'm' }, { status }) });
      const result = await createCatalogStore({ fetch, storage: memoryStorage(), bundledCatalog }).save(serverCatalog());
      assert.equal(result.status, expected, String(status));
    }
  });

  it('force envia sem If-Match', async () => {
    const fetch = fakeFetch({ PUT: (init) => json({ catalog: JSON.parse(init.body) }) });
    await createCatalogStore({ fetch, storage: memoryStorage(), bundledCatalog }).save(serverCatalog(), { baseEtag: '"v1"', force: true });
    assert.equal(fetch.calls[0].headers['If-Match'], undefined);
  });

  it('descartar alterações locais NUNCA escreve no servidor (antes o "Resetar" apagava o catálogo real)', async () => {
    const local = serverCatalog();
    local.author.name = 'Local';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ catalog: local, pendingSync: true }) });
    const fetch = fakeFetch({ GET: () => json(serverCatalog()) });
    const state = await createCatalogStore({ fetch, storage, bundledCatalog }).discardLocal();
    assert.equal(state.origin, 'api');
    assert.equal(state.catalog.author.name, 'Lucas Belucci Bellini');
    assert.deepEqual(fetch.calls.map((c) => c.method), ['GET']);
  });
});

describe('views', () => {
  const baseState = (catalog) => ({ catalog, origin: 'api', pendingSync: false, apiAvailable: true });

  it('esc escapa os cinco caracteres especiais', () => {
    assert.equal(esc(`<a href="x" onclick='y'>&</a>`), '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  });

  it('dado do catálogo não vira HTML (XSS)', () => {
    const catalog = loadCatalog();
    const book = catalog.collections[0].arcs[0].books[0];
    book.title = '<img src=x onerror=alert(1)>';
    book.description = '"><script>alert(2)</script>';
    catalog.collections[0].title = '<b>coleção</b>';
    const html = renderApp(baseState(catalog));
    assert.doesNotMatch(html, /<img src=x|<script>|<b>coleção/);
    assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  });

  it('capa com URL perigosa é trocada pela imagem padrão', () => {
    assert.doesNotMatch(safeImg('javascript:alert(1)'), /javascript/);
    assert.equal(safeImg('https://ex.com/a.jpg?x=1&y=2'), 'https://ex.com/a.jpg?x=1&amp;y=2');
  });

  it('mostra estado vazio e o aviso de alterações pendentes', () => {
    const html = renderApp({ ...baseState({ author: { name: 'A' }, collections: [] }), origin: 'local', pendingSync: true });
    assert.match(html, /Nenhum livro no catálogo ainda/);
    assert.match(html, /data-action="sync"/);
    assert.match(html, /data-action="discard"/);
  });

  it('marca campos inválidos para leitores de tela', () => {
    const html = renderApp({ ...baseState(loadCatalog()), formErrors: { title: 'Informe o título do livro.' } });
    assert.match(html, /id="book-title"[^>]*aria-invalid="true" aria-describedby="book-title-error"/);
    assert.match(html, /id="book-title-error">Informe o título do livro\./);
  });
});
