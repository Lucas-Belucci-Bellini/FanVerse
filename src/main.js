/**
 * Entrada da interface web do FanVerse (frontend principal — ver DEC-006).
 *
 * Responsabilidades ficam separadas:
 * - `shared/catalog.js`      contrato do catálogo e caso de uso "adicionar livro";
 * - `src/app/catalog-store.js` de onde o catálogo vem e para onde vai (API/localStorage);
 * - `src/app/views.js`        HTML (com escape de todo dado do catálogo);
 * - este arquivo              estado da tela e eventos.
 */
import './style.css';

import bundledCatalog from '../data/catalogo.json';
import { addBook } from '../shared/catalog.js';
import { createCatalogStore } from './app/catalog-store.js';
import { renderApp, renderFatalError, renderLoading } from './app/views.js';

const root = document.querySelector('#app');

const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null; // bloqueado pelo navegador: o app funciona sem cache local
  }
})();

const store = createCatalogStore({ fetch: window.fetch.bind(window), storage, bundledCatalog });

let state = null;

function render() {
  root.innerHTML = renderApp(state);
}

function update(patch) {
  state = { ...state, ...patch };
  render();
}

const SAVE_MESSAGES = {
  synced: { type: 'success', text: 'Catálogo salvo e enviado ao servidor.' },
  local: { type: 'info', text: 'Servidor indisponível: a alteração ficou salva apenas neste navegador.' },
  forbidden: { type: 'warning', text: 'O servidor recusou a escrita. A alteração ficou salva apenas neste navegador.' },
  conflict: { type: 'error', text: 'O catálogo mudou no servidor desde que esta página foi aberta. Descarte as alterações locais e tente de novo.' },
  invalid: { type: 'error', text: 'O servidor recusou o catálogo por não seguir o contrato.' },
};

function applySaveResult(result, { successMessage } = {}) {
  const synced = result.status === 'synced';
  const base = SAVE_MESSAGES[result.status] ?? SAVE_MESSAGES.local;
  update({
    busy: false,
    catalog: result.catalog,
    baseEtag: result.baseEtag,
    origin: synced ? 'api' : 'local',
    pendingSync: !synced,
    apiAvailable: synced || result.status !== 'local',
    message: synced && successMessage ? { type: 'success', text: successMessage } : {
      ...base,
      text: result.message && !synced ? `${base.text} (${result.message})` : base.text,
    },
  });
}

async function handleSubmit(form) {
  const input = Object.fromEntries(new FormData(form));
  const result = addBook(state.catalog, input);

  if (!result.ok) {
    const formErrors = {};
    for (const error of result.errors) formErrors[error.path] ??= error.message;
    update({ formErrors, formValues: input, message: { type: 'error', text: 'Corrija os campos destacados.' } });
    root.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  update({ busy: true, formErrors: null, formValues: input, message: null });
  const saved = await store.save(result.catalog, { baseEtag: state.baseEtag });
  state.formValues = null;
  applySaveResult(saved, { successMessage: `“${result.book.title}” adicionado e enviado ao servidor.` });
}

async function handleSync() {
  if (!state.baseEtag && !window.confirm(
    'Não é possível confirmar se o catálogo do servidor mudou desde esta cópia local. Enviar mesmo assim vai substituí-lo. Continuar?',
  )) return;
  update({ busy: true, message: null });
  applySaveResult(await store.save(state.catalog, { baseEtag: state.baseEtag, force: !state.baseEtag }));
}

async function handleDiscard() {
  if (!window.confirm('Descartar as alterações feitas neste navegador? O catálogo do servidor não é alterado.')) return;
  const loaded = await store.discardLocal();
  update({ ...loaded, busy: false, formErrors: null, message: { type: 'info', text: 'Alterações locais descartadas.' } });
}

root.addEventListener('submit', (event) => {
  if (event.target.id !== 'catalog-form') return;
  event.preventDefault();
  if (!state.busy) handleSubmit(event.target);
});

root.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action || state.busy) return;
  if (action === 'sync') handleSync();
  if (action === 'discard') handleDiscard();
});

async function init() {
  root.innerHTML = renderLoading();
  try {
    state = { ...(await store.load()), busy: false, message: null };
    render();
  } catch (error) {
    console.error('Falha ao iniciar o FanVerse:', error);
    root.innerHTML = renderFatalError(error);
  }
}

init();
