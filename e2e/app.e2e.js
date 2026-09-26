/**
 * Teste de ponta a ponta do frontend principal num navegador real.
 *
 * Sobe o servidor de verdade (`createApp`) servindo o build do Vite (`dist/`) com
 * uma cópia temporária do catálogo, e dirige o Chromium/Chrome com playwright-core.
 * Cobre os fluxos que antes eram verificados só à mão (ver docs/STATUS.md).
 *
 *   npm run test:e2e        (faz o build e roda)
 *
 * Navegador: `FANVERSE_E2E_BROWSER=/caminho/do/chrome` ou, por padrão, o Google
 * Chrome instalado (`FANVERSE_E2E_CHANNEL`, padrão "chrome"). Nada é baixado.
 */
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright-core';

import { createApp } from '../server/app.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = path.join(ROOT, 'dist');
const DATA_FILE = path.join(ROOT, 'data', 'catalogo.json');
const silent = { error() {}, warn() {} };

// PNG 1×1: as capas vêm do Unsplash; o teste não depende de rede externa.
const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

async function startServer({ brokenApi = false } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'fanverse-e2e-'));
  // API quebrada = arquivo de dados num diretório que não existe: GET e PUT respondem 500.
  const dataPath = brokenApi ? path.join(dir, 'nao-existe', 'catalogo.json') : path.join(dir, 'catalogo.json');
  if (!brokenApi) copyFileSync(DATA_FILE, dataPath);
  const app = createApp({ dataPath, distDir: DIST, siteDir: path.join(ROOT, 'site'), logger: silent });
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return {
    url: `http://127.0.0.1:${server.address().port}/`,
    dataPath,
    close: () => new Promise((resolve) => server.close(() => { rmSync(dir, { recursive: true, force: true }); resolve(); })),
  };
}

const launchOptions = process.env.FANVERSE_E2E_BROWSER
  ? { executablePath: process.env.FANVERSE_E2E_BROWSER }
  : { channel: process.env.FANVERSE_E2E_CHANNEL || 'chrome' };

let browser;

before(async () => {
  assert.ok(existsSync(path.join(DIST, 'index.html')), 'dist/ não encontrado: rode `npm run build` (ou use `npm run test:e2e`).');
  try {
    browser = await chromium.launch(launchOptions);
  } catch (error) {
    throw new Error(`Não foi possível abrir o navegador (${JSON.stringify(launchOptions)}). `
      + `Instale o Google Chrome ou defina FANVERSE_E2E_BROWSER com o caminho do executável.\n${error.message}`);
  }
});

after(() => browser?.close());

/** Página nova (localStorage limpo), sem rede externa, registrando erros de JS. */
async function openPage(url, { viewport = { width: 1280, height: 900 } } = {}) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.route((u) => !u.href.startsWith(url), (route) => route.fulfill({ contentType: 'image/png', body: PIXEL }));
  await page.goto(url);
  await page.waitForSelector('#catalogo .card, .empty-state');
  return { page, errors, close: () => context.close() };
}

const cards = (page) => page.locator('#catalogo .card').count();

async function addBook(page, { title, collection = 'Crônicas da Baluarte', description = 'Criado pelo teste e2e.', price = '15.5' }) {
  await page.fill('#book-title', title);
  await page.fill('#book-collection', collection);
  await page.fill('#book-description', description);
  await page.fill('#book-price', price);
  await page.click('#catalog-form button[type=submit]');
  await page.waitForSelector('.form-message');
  return page.locator('.form-message').textContent();
}

describe('frontend com a API funcionando', () => {
  let server;
  before(async () => { server = await startServer(); });
  after(() => server.close());

  it('abre com o catálogo da API, sem aviso e sem erros no console', async () => {
    const { page, errors, close } = await openPage(server.url);
    try {
      assert.equal(await cards(page), 4);
      assert.equal(await page.locator('.notice').count(), 0);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });

  it('adiciona livro: grava no servidor, sobrevive ao recarregar e o HTML do título vira texto', async () => {
    const { page, errors, close } = await openPage(server.url);
    try {
      const message = await addBook(page, { title: 'Livro 04 — <b>A Torre</b>' });
      assert.match(message, /adicionado e enviado ao servidor/);
      assert.equal(await cards(page), 5);
      assert.equal(await page.locator('#catalogo h3 b').count(), 0, 'o <b> do título não pode virar HTML');
      assert.equal(await page.locator('#catalogo h3', { hasText: 'Livro 04 — <b>A Torre</b>' }).count(), 1, 'o título deve aparecer literalmente');

      const onDisk = JSON.parse(readFileSync(server.dataPath, 'utf-8'));
      const titles = onDisk.collections.flatMap((c) => c.arcs.flatMap((a) => a.books.map((b) => b.title)));
      assert.ok(titles.includes('Livro 04 — <b>A Torre</b>'));
      assert.equal(onDisk.schemaVersion, 1);

      await page.reload();
      await page.waitForSelector('#catalogo .card');
      assert.equal(await cards(page), 5);
      assert.equal(await page.locator('.notice').count(), 0, 'nada deve ficar pendente após sincronizar');
      assert.deepEqual(errors, []);
    } finally { await close(); }
  });

  it('formulário vazio mostra erro em cada campo e foca o primeiro', async () => {
    const { page, close } = await openPage(server.url);
    try {
      await page.fill('#book-price', '');
      await page.click('#catalog-form button[type=submit]');
      await page.waitForSelector('.field-error');
      assert.equal(await page.locator('.field-error').count(), 4);
      assert.equal(await page.evaluate(() => document.activeElement?.id), 'book-title');
      assert.equal(await page.locator('#book-title[aria-invalid="true"]').count(), 1);
    } finally { await close(); }
  });

  it('em 375 px o menu continua visível e não há rolagem horizontal', async () => {
    const { page, close } = await openPage(server.url, { viewport: { width: 375, height: 800 } });
    try {
      assert.equal(await page.locator('.nav-links').isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    } finally { await close(); }
  });
});

describe('frontend com a API fora do ar', () => {
  let server;
  before(async () => { server = await startServer({ brokenApi: true }); });
  after(() => server.close());

  it('usa o catálogo embutido, guarda a edição como pendente e permite descartar', async () => {
    const { page, errors, close } = await openPage(server.url);
    try {
      assert.equal(await cards(page), 4, 'deve mostrar os 4 livros embutidos no build (antes caía em 2)');
      assert.match(await page.locator('.notice').textContent(), /catálogo publicado com o site/);

      assert.match(await addBook(page, { title: 'Livro offline' }), /salva apenas neste navegador/);
      await page.reload();
      await page.waitForSelector('#catalogo .card');
      assert.equal(await cards(page), 5, 'a edição local deve sobreviver ao recarregar');
      assert.match(await page.locator('.notice').textContent(), /ainda não enviadas ao servidor/);
      assert.equal(await page.locator('[data-action="sync"]').count(), 0, 'sem API não há como enviar');

      page.once('dialog', (dialog) => dialog.accept());
      await page.click('[data-action="discard"]');
      await page.waitForSelector('.form-message');
      assert.equal(await cards(page), 4);
      assert.match(await page.locator('.form-message').textContent(), /descartadas/);

      // Só os 500 esperados da API quebrada; nenhum erro de JavaScript.
      assert.deepEqual(errors.filter((e) => !/status of 500/.test(e)), []);
    } finally { await close(); }
  });
});
