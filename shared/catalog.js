/**
 * Contrato do catálogo FanVerse — fonte única de regras para servidor e frontend.
 *
 * Este módulo não depende de DOM nem de Node: roda no Express (validação do PUT),
 * no navegador (editor) e nos testes (`node --test`). O contrato está descrito em
 * docs/DATA_MODEL.md; qualquer mudança aqui deve ser refletida lá.
 */

/** Versão atual do schema do catálogo. Catálogos sem o campo são tratados como v1. */
export const SCHEMA_VERSION = 1;

/** Tipos de livro aceitos no catálogo web (espelham LivroDigital/LivroFisico do Java). */
export const BOOK_TYPES = Object.freeze(['digital', 'fisico']);

/** Limites defensivos: impedem que um payload gigante ou malformado seja gravado. */
export const LIMITS = Object.freeze({
  shortText: 200,
  label: 60,
  longText: 5000,
  content: 500_000,
  collections: 200,
  arcsPerCollection: 200,
  booksPerArc: 500,
  maxPrice: 100_000,
});

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID_MAX = 80;

/**
 * Aceita URLs http(s) absolutas ou caminhos relativos. Recusa esquemas como
 * `javascript:` e `data:`, que viram vetor de ataque quando o valor chega ao HTML.
 */
export function isSafeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '' || value.length > 2048) return false;
  try {
    const url = new URL(value, 'http://relative.invalid/');
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Transforma um texto livre em identificador (`Crônicas da Baluarte` → `cronicas-da-baluarte`). */
export function slugify(text) {
  const slug = String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, ID_MAX - 6)
    .replace(/-+$/g, '');
  return slug || 'item';
}

/** Gera um ID a partir de `base` que ainda não exista em `taken` (Set ou array). */
export function uniqueId(base, taken) {
  const used = taken instanceof Set ? taken : new Set(taken);
  const root = slugify(base);
  if (!used.has(root)) return root;
  for (let n = 2; ; n += 1) {
    const candidate = `${root}-${n}`;
    if (!used.has(candidate)) return candidate;
  }
}

/**
 * Lista plana de livros, com a coleção e o arco de origem anexados.
 * Formato usado por `GET /api/catalogo/books` e pelos cards do frontend.
 */
export function flattenBooks(catalog) {
  return (catalog?.collections ?? []).flatMap((collection) =>
    (collection.arcs ?? []).flatMap((arc) =>
      (arc.books ?? []).map((book) => ({
        ...book,
        collectionId: collection.id,
        collectionTitle: collection.title,
        arcId: arc.id,
        arcTitle: arc.title,
      }))
    )
  );
}

export function findBook(catalog, id) {
  return flattenBooks(catalog).find((book) => book.id === id) ?? null;
}

export function findCollection(catalog, id) {
  return (catalog?.collections ?? []).find((collection) => collection.id === id) ?? null;
}

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Valida um catálogo contra o contrato v1.
 *
 * Campos desconhecidos são preservados (compatibilidade para frente); campos
 * conhecidos precisam ter o tipo certo. Retorna todos os erros encontrados, com
 * o caminho de cada um (`collections[0].arcs[1].books[0].price`).
 *
 * @returns {{ ok: boolean, errors: Array<{ path: string, message: string }> }}
 */
export function validateCatalog(catalog) {
  const errors = [];
  const fail = (path, message) => errors.push({ path, message });

  const text = (value, path, { required = false, max = LIMITS.shortText } = {}) => {
    if (value === undefined || value === null) {
      if (required) fail(path, 'campo obrigatório');
      return;
    }
    if (typeof value !== 'string') return fail(path, 'deve ser texto');
    if (required && value.trim() === '') return fail(path, 'não pode ficar vazio');
    if (value.length > max) fail(path, `deve ter no máximo ${max} caracteres`);
  };

  const integer = (value, path, { min, max = 9999, required = false } = {}) => {
    if (value === undefined || value === null) {
      if (required) fail(path, 'campo obrigatório');
      return;
    }
    if (!Number.isInteger(value)) return fail(path, 'deve ser um número inteiro');
    if (value < min || value > max) fail(path, `deve estar entre ${min} e ${max}`);
  };

  const url = (value, path) => {
    if (value === undefined || value === null) return;
    if (!isSafeUrl(value)) fail(path, 'deve ser uma URL http(s) ou um caminho relativo');
  };

  const id = (value, path, seen) => {
    if (typeof value !== 'string' || !ID_PATTERN.test(value) || value.length > ID_MAX) {
      return fail(path, 'deve ser um identificador em minúsculas com hífens (ex.: "arco-01")');
    }
    if (seen.has(value)) return fail(path, `identificador duplicado: "${value}"`);
    seen.add(value);
  };

  const list = (value, path, max) => {
    if (!Array.isArray(value)) {
      fail(path, 'deve ser uma lista');
      return [];
    }
    if (value.length > max) fail(path, `deve ter no máximo ${max} itens`);
    return value;
  };

  if (!isPlainObject(catalog)) {
    fail('', 'o catálogo deve ser um objeto');
    return { ok: false, errors };
  }

  if (catalog.schemaVersion !== undefined && catalog.schemaVersion !== SCHEMA_VERSION) {
    fail('schemaVersion', `versão de schema não suportada (esperado ${SCHEMA_VERSION})`);
  }

  if (!isPlainObject(catalog.author)) {
    fail('author', 'campo obrigatório (objeto com pelo menos "name")');
  } else {
    const a = catalog.author;
    text(a.name, 'author.name', { required: true });
    text(a.bio, 'author.bio', { max: LIMITS.longText });
    text(a.location, 'author.location');
    text(a.specialty, 'author.specialty');
    url(a.photo, 'author.photo');
  }

  const collectionIds = new Set();
  const bookIds = new Set();

  list(catalog.collections, 'collections', LIMITS.collections).forEach((collection, ci) => {
    const cp = `collections[${ci}]`;
    if (!isPlainObject(collection)) return fail(cp, 'deve ser um objeto');
    id(collection.id, `${cp}.id`, collectionIds);
    text(collection.title, `${cp}.title`, { required: true });
    text(collection.description, `${cp}.description`, { max: LIMITS.longText });
    text(collection.author, `${cp}.author`);
    integer(collection.year, `${cp}.year`, { min: 1 });
    url(collection.cover, `${cp}.cover`);

    const arcIds = new Set();
    list(collection.arcs, `${cp}.arcs`, LIMITS.arcsPerCollection).forEach((arc, ai) => {
      const ap = `${cp}.arcs[${ai}]`;
      if (!isPlainObject(arc)) return fail(ap, 'deve ser um objeto');
      id(arc.id, `${ap}.id`, arcIds);
      integer(arc.number, `${ap}.number`, { min: 1, required: true });
      text(arc.title, `${ap}.title`, { required: true });
      text(arc.description, `${ap}.description`, { max: LIMITS.longText });
      text(arc.status, `${ap}.status`, { max: LIMITS.label });

      list(arc.books, `${ap}.books`, LIMITS.booksPerArc).forEach((book, bi) => {
        const bp = `${ap}.books[${bi}]`;
        if (!isPlainObject(book)) return fail(bp, 'deve ser um objeto');
        id(book.id, `${bp}.id`, bookIds);
        text(book.title, `${bp}.title`, { required: true });
        text(book.description, `${bp}.description`, { max: LIMITS.longText });
        if (!BOOK_TYPES.includes(book.type)) {
          fail(`${bp}.type`, `deve ser um de: ${BOOK_TYPES.join(', ')}`);
        }
        if (typeof book.price !== 'number' || !Number.isFinite(book.price)) {
          fail(`${bp}.price`, 'deve ser um número');
        } else if (book.price < 0 || book.price > LIMITS.maxPrice) {
          fail(`${bp}.price`, `deve estar entre 0 e ${LIMITS.maxPrice}`);
        }
        text(book.status, `${bp}.status`, { max: LIMITS.label });
        text(book.availability, `${bp}.availability`, { max: LIMITS.label });
        integer(book.year, `${bp}.year`, { min: 1 });
        integer(book.chapters, `${bp}.chapters`, { min: 0, max: 100_000 });
        url(book.cover, `${bp}.cover`);
        text(book.content, `${bp}.content`, { max: LIMITS.content });
      });
    });
  });

  return { ok: errors.length === 0, errors };
}

/** Cópia do catálogo com `schemaVersion` explícito — formato gravado em disco. */
export function withSchemaVersion(catalog) {
  const { schemaVersion: _ignored, ...rest } = catalog;
  return { schemaVersion: SCHEMA_VERSION, ...rest };
}

const DEFAULT_COLLECTION_COVER =
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_BOOK_COVER =
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80';

/**
 * Caso de uso do editor: adiciona um livro digital a uma coleção (criada se não
 * existir, comparando o título sem diferenciar maiúsculas). Não altera o
 * catálogo recebido — devolve uma cópia nova.
 *
 * @param {object} catalog catálogo atual (válido)
 * @param {{ title: string, collectionTitle: string, description: string, price: number|string }} input
 * @param {{ now?: Date }} [options]
 * @returns {{ ok: true, catalog: object, book: object } | { ok: false, errors: Array<{path: string, message: string}> }}
 */
export function addBook(catalog, input, { now = new Date() } = {}) {
  const title = String(input?.title ?? '').trim();
  const collectionTitle = String(input?.collectionTitle ?? '').trim();
  const description = String(input?.description ?? '').trim();
  const rawPrice = typeof input?.price === 'number' ? input.price : String(input?.price ?? '').trim().replace(',', '.');
  // Number('') é 0: preço vazio precisa ser recusado explicitamente, não virar "grátis".
  const price = rawPrice === '' ? Number.NaN : Number(rawPrice);

  const errors = [];
  if (!title) errors.push({ path: 'title', message: 'Informe o título do livro.' });
  if (title.length > LIMITS.shortText) errors.push({ path: 'title', message: `O título deve ter no máximo ${LIMITS.shortText} caracteres.` });
  if (!collectionTitle) errors.push({ path: 'collectionTitle', message: 'Informe a coleção.' });
  if (collectionTitle.length > LIMITS.shortText) errors.push({ path: 'collectionTitle', message: `A coleção deve ter no máximo ${LIMITS.shortText} caracteres.` });
  if (!description) errors.push({ path: 'description', message: 'Informe a descrição.' });
  if (description.length > LIMITS.longText) errors.push({ path: 'description', message: `A descrição deve ter no máximo ${LIMITS.longText} caracteres.` });
  if (!Number.isFinite(price) || price < 0 || price > LIMITS.maxPrice) {
    errors.push({ path: 'price', message: `O preço deve ser um número entre 0 e ${LIMITS.maxPrice}.` });
  }
  if (errors.length) return { ok: false, errors };

  const next = structuredClone(catalog);
  const year = now.getFullYear();
  const wanted = collectionTitle.toLowerCase();
  let collection = next.collections.find((item) => String(item.title).toLowerCase() === wanted);

  if (!collection) {
    collection = {
      id: uniqueId(collectionTitle, next.collections.map((item) => item.id)),
      title: collectionTitle,
      description: 'Nova coleção adicionada pelo editor do site.',
      author: next.author?.name ?? '',
      year,
      cover: DEFAULT_COLLECTION_COVER,
      arcs: [],
    };
    next.collections.push(collection);
  }

  if (!Array.isArray(collection.arcs) || collection.arcs.length === 0) {
    collection.arcs = [{
      id: 'arco-01',
      number: 1,
      title: 'Arco 01 — Novo arco',
      description: 'Arco recém-criado pela edição do catálogo.',
      status: 'Disponível',
      books: [],
    }];
  }

  const book = {
    id: uniqueId(title, flattenBooks(next).map((item) => item.id)),
    title,
    description,
    type: 'digital',
    price: Math.round(price * 100) / 100,
    status: 'Ler agora',
    availability: 'DIGITAL_DISPONIVEL',
    year,
    chapters: 1,
    cover: DEFAULT_BOOK_COVER,
    content: '',
  };
  collection.arcs[0].books.push(book);

  const check = validateCatalog(next);
  if (!check.ok) return { ok: false, errors: check.errors };
  return { ok: true, catalog: next, book };
}
