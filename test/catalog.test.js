import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SCHEMA_VERSION, addBook, findBook, findCollection, flattenBooks, isSafeUrl, slugify, uniqueId,
  validateCatalog, withSchemaVersion,
} from '../shared/catalog.js';
import { loadCatalog } from './helpers.js';

const paths = (result) => result.errors.map((error) => error.path);

describe('validateCatalog', () => {
  it('aceita o catálogo versionado em data/catalogo.json', () => {
    const result = validateCatalog(loadCatalog());
    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it('recusa o payload que antes corrompia o arquivo ({ collections: [{ x: 1 }] })', () => {
    const result = validateCatalog({ collections: [{ x: 1 }] });
    assert.equal(result.ok, false);
    assert.ok(paths(result).includes('author'));
    assert.ok(paths(result).includes('collections[0].id'));
    assert.ok(paths(result).includes('collections[0].arcs'));
  });

  it('recusa valores que não são objeto', () => {
    for (const value of [null, [], 'x', 42]) {
      assert.equal(validateCatalog(value).ok, false, JSON.stringify(value));
    }
  });

  it('detecta IDs de livro duplicados entre coleções', () => {
    const catalog = loadCatalog();
    catalog.collections[1].arcs[0].books[0].id = catalog.collections[0].arcs[0].books[0].id;
    const result = validateCatalog(catalog);
    assert.equal(result.ok, false);
    assert.match(result.errors[0].message, /duplicado/);
  });

  it('permite o mesmo ID de arco em coleções diferentes (escopo é a coleção)', () => {
    const catalog = loadCatalog();
    catalog.collections[1].arcs[0].id = catalog.collections[0].arcs[0].id;
    assert.equal(validateCatalog(catalog).ok, true);
  });

  it('valida preço, tipo e URL de capa de cada livro', () => {
    const catalog = loadCatalog();
    const book = catalog.collections[0].arcs[0].books[0];
    book.price = -1;
    book.type = 'audiobook';
    book.cover = 'javascript:alert(1)';
    assert.deepEqual(paths(validateCatalog(catalog)).sort(), [
      'collections[0].arcs[0].books[0].cover',
      'collections[0].arcs[0].books[0].price',
      'collections[0].arcs[0].books[0].type',
    ]);
  });

  it('recusa preço NaN/Infinity e aceita preço zero', () => {
    const catalog = loadCatalog();
    const book = catalog.collections[0].arcs[0].books[0];
    for (const price of [Number.NaN, Number.POSITIVE_INFINITY, '9.90']) {
      book.price = price;
      assert.equal(validateCatalog(catalog).ok, false, String(price));
    }
    book.price = 0;
    assert.equal(validateCatalog(catalog).ok, true);
  });

  it('preserva campos desconhecidos (compatibilidade para frente)', () => {
    const catalog = loadCatalog();
    catalog.collections[0].tags = ['épico'];
    assert.equal(validateCatalog(catalog).ok, true);
  });

  it('só aceita a versão de schema suportada', () => {
    const catalog = loadCatalog();
    catalog.schemaVersion = SCHEMA_VERSION + 1;
    assert.deepEqual(paths(validateCatalog(catalog)), ['schemaVersion']);
    assert.equal(validateCatalog(withSchemaVersion(loadCatalog())).ok, true);
  });
});

describe('consultas', () => {
  it('flattenBooks anexa coleção e arco de origem', () => {
    const books = flattenBooks(loadCatalog());
    assert.equal(books.length, 4);
    assert.deepEqual(
      { id: books[3].id, collectionId: books[3].collectionId, arcId: books[3].arcId },
      { id: 'sol-01', collectionId: 'fanfic-do-sol', arcId: 'arco-sol-01' },
    );
  });

  it('findBook/findCollection devolvem null quando não existe', () => {
    const catalog = loadCatalog();
    assert.equal(findBook(catalog, 'baluarte-03').arcTitle, 'Arco 02 — O Vale dos Lamentos');
    assert.equal(findBook(catalog, 'nao-existe'), null);
    assert.equal(findCollection(catalog, 'fanfic-do-sol').title, 'A FanFic do Sol');
    assert.equal(findCollection(catalog, 'nao-existe'), null);
  });
});

describe('utilitários de ID e URL', () => {
  it('slugify remove acentos e símbolos', () => {
    assert.equal(slugify('Crônicas da Baluarte — Livro 04!'), 'cronicas-da-baluarte-livro-04');
    assert.equal(slugify('   '), 'item');
  });

  it('uniqueId acrescenta sufixo quando o ID já existe', () => {
    assert.equal(uniqueId('Novo Livro', ['novo-livro', 'novo-livro-2']), 'novo-livro-3');
  });

  it('isSafeUrl aceita http(s) e caminhos relativos, recusa javascript:/data:', () => {
    for (const ok of ['https://example.com/a.jpg', 'http://x.y/z', '/covers/a.png', 'covers/a.png']) {
      assert.equal(isSafeUrl(ok), true, ok);
    }
    for (const bad of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:image/png;base64,AA', '', 42]) {
      assert.equal(isSafeUrl(bad), false, String(bad));
    }
  });
});

describe('addBook (caso de uso do editor)', () => {
  const input = { title: 'Livro 04 — A Torre', collectionTitle: 'crônicas da baluarte', description: 'Nova obra.', price: '19,90' };

  it('adiciona à coleção existente sem mutar o catálogo original', () => {
    const catalog = loadCatalog();
    const before = JSON.stringify(catalog);
    const result = addBook(catalog, input, { now: new Date('2026-01-15T12:00:00Z') });
    assert.equal(result.ok, true);
    assert.equal(JSON.stringify(catalog), before);
    assert.equal(result.catalog.collections.length, 2);
    assert.deepEqual(
      { id: result.book.id, price: result.book.price, year: result.book.year },
      { id: 'livro-04-a-torre', price: 19.9, year: 2026 },
    );
    assert.equal(findBook(result.catalog, 'livro-04-a-torre').collectionId, 'cronicas-da-baluarte');
  });

  it('cria coleção nova com ID derivado do título', () => {
    const result = addBook(loadCatalog(), { ...input, collectionTitle: 'Contos do Norte' });
    assert.equal(result.ok, true);
    const created = findCollection(result.catalog, 'contos-do-norte');
    assert.equal(created.arcs[0].books[0].id, result.book.id);
    assert.equal(validateCatalog(result.catalog).ok, true);
  });

  it('gera ID único quando o título repete', () => {
    const first = addBook(loadCatalog(), input);
    const second = addBook(first.catalog, input);
    assert.equal(second.book.id, 'livro-04-a-torre-2');
  });

  it('recusa entrada inválida com mensagens por campo', () => {
    const result = addBook(loadCatalog(), { title: ' ', collectionTitle: '', description: '', price: 'abc' });
    assert.equal(result.ok, false);
    assert.deepEqual(result.errors.map((e) => e.path), ['title', 'collectionTitle', 'description', 'price']);
    assert.equal(addBook(loadCatalog(), { ...input, price: -5 }).ok, false);
  });
});
