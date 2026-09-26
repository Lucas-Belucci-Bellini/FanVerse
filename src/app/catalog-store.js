import { validateCatalog } from '../../shared/catalog.js';

/** Chave atual do cache local. Guarda `{ version, catalog, pendingSync, baseEtag, savedAt }`. */
export const STORAGE_KEY = 'fanverse:catalog:v2';
/** Chave antiga: guardava só o catálogo cru e tinha prioridade sobre o servidor. */
export const LEGACY_STORAGE_KEY = 'fanverse-catalog-local';

/**
 * Carregamento e persistência do catálogo no navegador (ver DEC-007).
 *
 * Ordem de leitura:
 *   1. alterações locais ainda não enviadas (`pendingSync`) — nunca são descartadas em silêncio;
 *   2. a API (`GET /api/catalogo`), que é a fonte de verdade;
 *   3. a última cópia recebida da API (cache, quando o servidor está fora);
 *   4. o catálogo embutido no build (`data/catalogo.json` importado pelo Vite).
 *
 * Dependências injetadas para poder testar sem navegador.
 *
 * @param {object} deps
 * @param {typeof fetch} deps.fetch
 * @param {Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null} deps.storage
 * @param {object} deps.bundledCatalog
 */
export function createCatalogStore({ fetch, storage, bundledCatalog }) {
  const readJson = (key) => {
    try {
      const raw = storage?.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const writeLocal = (entry) => {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 2, savedAt: new Date().toISOString(), ...entry }));
    } catch {
      // Storage cheio ou bloqueado (modo privado): segue só em memória.
    }
  };

  const removeKey = (key) => {
    try { storage?.removeItem(key); } catch { /* idem */ }
  };

  const readLocal = () => {
    const entry = readJson(STORAGE_KEY);
    if (entry && validateCatalog(entry.catalog).ok) return entry;
    if (entry) removeKey(STORAGE_KEY);
    return null;
  };

  async function fetchRemote() {
    try {
      const response = await fetch('/api/catalogo', { cache: 'no-store', headers: { Accept: 'application/json' } });
      // Sem API, servidores estáticos respondem 200 com HTML — não é catálogo.
      if (!response.ok || !(response.headers.get('content-type') ?? '').includes('application/json')) return null;
      const catalog = await response.json();
      if (!validateCatalog(catalog).ok) return null;
      return { catalog, etag: response.headers.get('etag') };
    } catch {
      return null;
    }
  }

  /** Migra a chave antiga: só vira "pendente" se diferir do que o servidor tem. */
  function migrateLegacy(remote) {
    const legacy = readJson(LEGACY_STORAGE_KEY);
    removeKey(LEGACY_STORAGE_KEY);
    if (!legacy || !validateCatalog(legacy).ok) return null;
    if (remote && JSON.stringify(legacy) === JSON.stringify(remote.catalog)) return null;
    const entry = { catalog: legacy, pendingSync: true, baseEtag: null };
    writeLocal(entry);
    return entry;
  }

  /**
   * @returns {Promise<{ catalog: object, origin: 'api'|'local'|'cache'|'bundled', pendingSync: boolean, apiAvailable: boolean, baseEtag: string|null }>}
   */
  async function load() {
    const remote = await fetchRemote();
    const local = readLocal() ?? migrateLegacy(remote);
    const apiAvailable = Boolean(remote);

    if (local?.pendingSync) {
      return { catalog: local.catalog, origin: 'local', pendingSync: true, apiAvailable, baseEtag: local.baseEtag ?? null };
    }
    if (remote) {
      writeLocal({ catalog: remote.catalog, pendingSync: false, baseEtag: remote.etag });
      return { catalog: remote.catalog, origin: 'api', pendingSync: false, apiAvailable, baseEtag: remote.etag };
    }
    if (local) {
      return { catalog: local.catalog, origin: 'cache', pendingSync: false, apiAvailable, baseEtag: local.baseEtag ?? null };
    }
    return { catalog: structuredClone(bundledCatalog), origin: 'bundled', pendingSync: false, apiAvailable, baseEtag: null };
  }

  /**
   * Salva primeiro no navegador (marcado como pendente) e depois tenta a API.
   *
   * @param {object} catalog
   * @param {{ baseEtag?: string|null, force?: boolean }} [options] `force` envia sem If-Match
   * @returns {Promise<{ status: 'synced'|'local'|'conflict'|'forbidden'|'invalid', catalog: object, baseEtag: string|null, message?: string }>}
   */
  async function save(catalog, { baseEtag = null, force = false } = {}) {
    writeLocal({ catalog, pendingSync: true, baseEtag });

    let response;
    try {
      const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
      if (baseEtag && !force) headers['If-Match'] = baseEtag;
      response = await fetch('/api/catalogo', { method: 'PUT', headers, body: JSON.stringify(catalog) });
    } catch {
      return { status: 'local', catalog, baseEtag };
    }

    const isJson = (response.headers.get('content-type') ?? '').includes('application/json');
    const body = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && body?.catalog) {
      const etag = response.headers.get('etag');
      writeLocal({ catalog: body.catalog, pendingSync: false, baseEtag: etag });
      return { status: 'synced', catalog: body.catalog, baseEtag: etag };
    }
    if (response.status === 412) return { status: 'conflict', catalog, baseEtag, message: body?.message };
    if (response.status === 401 || response.status === 403) return { status: 'forbidden', catalog, baseEtag, message: body?.message };
    if (response.status === 400 && body?.error) return { status: 'invalid', catalog, baseEtag, message: body.message };
    return { status: 'local', catalog, baseEtag };
  }

  /** Descarta a cópia local e recarrega. Nunca escreve no servidor. */
  async function discardLocal() {
    removeKey(STORAGE_KEY);
    removeKey(LEGACY_STORAGE_KEY);
    return load();
  }

  return { load, save, discardLocal };
}
