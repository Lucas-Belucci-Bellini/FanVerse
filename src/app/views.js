import { flattenBooks, isSafeUrl } from '../../shared/catalog.js';

const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80';

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto para HTML. Todo dado do catálogo passa por aqui antes do innerHTML. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

/** URL de imagem segura (http(s) ou relativa) já escapada para atributo. */
export const safeImg = (value) => esc(isSafeUrl(value) ? value : PLACEHOLDER_COVER);

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatCurrency = (value) => (Number.isFinite(value) ? currency.format(value) : '—');

const ORIGIN_NOTICES = {
  local: {
    tone: 'warning',
    text: 'Há alterações salvas só neste navegador, ainda não enviadas ao servidor.',
  },
  cache: {
    tone: 'info',
    text: 'Servidor indisponível: exibindo a última cópia do catálogo recebida.',
  },
  bundled: {
    tone: 'info',
    text: 'Servidor indisponível: exibindo o catálogo publicado com o site. Novas alterações ficarão só neste navegador.',
  },
};

function renderNotice(state) {
  const notice = ORIGIN_NOTICES[state.origin];
  if (!notice) return '';
  const actions = state.pendingSync
    ? `<div class="notice-actions">
        ${state.apiAvailable ? '<button type="button" class="button small" data-action="sync">Enviar ao servidor</button>' : ''}
        <button type="button" class="button button-secondary small" data-action="discard">Descartar alterações locais</button>
      </div>`
    : '';
  return `<div class="notice notice-${notice.tone}" role="status">
      <p>${esc(notice.text)}</p>${actions}
    </div>`;
}

function renderMessage(message) {
  if (!message) return '';
  return `<p class="form-message form-message-${esc(message.type)}">${esc(message.text)}</p>`;
}

function renderBookCard(book) {
  return `
    <article class="card">
      <img class="cover" src="${safeImg(book.cover)}" alt="Capa de ${esc(book.title)}" loading="lazy" />
      <div class="card-body">
        <div class="meta-row">
          <span>${esc(book.collectionTitle)}</span>
          <span>${esc(book.year ?? '')}</span>
        </div>
        <h3>${esc(book.title)}</h3>
        <p>${esc(book.description)}</p>
        <div class="meta-row">
          <span class="status available">${esc(book.status)}</span>
          <span class="price">${esc(formatCurrency(book.price))}</span>
        </div>
      </div>
    </article>`;
}

function field({ id, name, label, errors, values, control }) {
  const error = errors?.[name];
  const describedBy = error ? ` aria-invalid="true" aria-describedby="${id}-error"` : '';
  return `
    <label for="${id}">
      ${esc(label)}
      ${control(describedBy, esc(values?.[name] ?? ''))}
      ${error ? `<span class="field-error" id="${id}-error">${esc(error)}</span>` : ''}
    </label>`;
}

/**
 * Página completa a partir do estado da aplicação.
 *
 * @param {object} state
 * @param {object} state.catalog
 * @param {string} state.origin      'api' | 'local' | 'cache' | 'bundled'
 * @param {boolean} state.pendingSync
 * @param {boolean} state.apiAvailable
 * @param {boolean} [state.busy]     salvando/sincronizando
 * @param {{type: string, text: string}} [state.message]
 * @param {Record<string, string>} [state.formErrors]
 * @param {Record<string, string>} [state.formValues]
 */
export function renderApp(state) {
  const { catalog } = state;
  const allBooks = flattenBooks(catalog);
  const featured = allBooks[0];
  const arcCount = catalog.collections.reduce((sum, collection) => sum + collection.arcs.length, 0);
  const values = state.formValues ?? { price: '19.99' };
  const disabled = state.busy ? ' disabled aria-busy="true"' : '';

  return `
    <div class="page-shell">
      <header class="topbar">
        <div class="container navbar">
          <div class="brand">FanVerse</div>
          <nav class="nav-links" aria-label="Seções da página">
            <a href="#inicio">Início</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#editor">Editar</a>
          </nav>
        </div>
      </header>

      <main id="inicio" class="container main-content">
        ${renderNotice(state)}

        <section class="hero panel-glass">
          <div class="hero-copy">
            <span class="tag">Coleções em crescimento</span>
            <h1>${esc(featured?.title || 'FanVerse')}</h1>
            <p>Biblioteca digital, fanfics e coleções em expansão, organizadas em arcos e livros.</p>
            <div class="hero-actions">
              <a class="button" href="#catalogo">Ver catálogo</a>
              <a class="button button-secondary" href="#editor">Atualizar catálogo</a>
            </div>
          </div>
          <div class="hero-art">
            <div class="art-card">
              <img src="${safeImg(featured?.cover)}" alt="${featured ? `Capa de ${esc(featured.title)}` : ''}" />
            </div>
          </div>
        </section>

        <section class="metrics-row" aria-label="Resumo do catálogo">
          <div class="metric-box"><strong>${allBooks.length}</strong><span>livros</span></div>
          <div class="metric-box"><strong>${catalog.collections.length}</strong><span>coleções</span></div>
          <div class="metric-box"><strong>${arcCount}</strong><span>arcos</span></div>
        </section>

        <section id="catalogo" class="section-block">
          <div class="section-head">
            <h2>Catálogo</h2>
          </div>
          ${allBooks.length
            ? `<div class="grid-3">${allBooks.map(renderBookCard).join('')}</div>`
            : '<p class="empty-state">Nenhum livro no catálogo ainda. Use o editor abaixo para adicionar o primeiro.</p>'}
        </section>

        <section id="editor" class="section-block editor-box">
          <div class="section-head">
            <h2>Editar catálogo no site</h2>
          </div>
          <p class="editor-note">
            O livro é salvo neste navegador e enviado ao servidor quando ele estiver disponível.
            O domínio Java em <strong>src/</strong> não é alterado.
          </p>

          <form id="catalog-form" class="catalog-form" novalidate>
            ${field({ id: 'book-title', name: 'title', label: 'Título do livro', errors: state.formErrors, values,
              control: (a, v) => `<input type="text" id="book-title" name="title" maxlength="200" placeholder="Ex.: Novo título" required value="${v}"${a} />` })}
            ${field({ id: 'book-collection', name: 'collectionTitle', label: 'Coleção', errors: state.formErrors, values,
              control: (a, v) => `<input type="text" id="book-collection" name="collectionTitle" maxlength="200" list="collection-options" placeholder="Ex.: Crônicas da Baluarte" required value="${v}"${a} />` })}
            <datalist id="collection-options">
              ${catalog.collections.map((c) => `<option value="${esc(c.title)}"></option>`).join('')}
            </datalist>
            ${field({ id: 'book-description', name: 'description', label: 'Descrição', errors: state.formErrors, values,
              control: (a, v) => `<textarea id="book-description" name="description" rows="4" maxlength="5000" placeholder="Descreva a obra..." required${a}>${v}</textarea>` })}
            ${field({ id: 'book-price', name: 'price', label: 'Preço (R$)', errors: state.formErrors, values,
              control: (a, v) => `<input type="number" id="book-price" name="price" min="0" step="0.01" required value="${v}"${a} />` })}
            <button type="submit" class="button"${disabled}>${state.busy ? 'Salvando…' : 'Salvar no catálogo'}</button>
          </form>
          <div id="form-status" aria-live="polite">${renderMessage(state.message)}</div>
        </section>
      </main>
    </div>`;
}

export function renderLoading() {
  return '<main class="container main-content"><p class="empty-state" role="status">Carregando catálogo…</p></main>';
}

export function renderFatalError(error) {
  return `
    <main class="container main-content">
      <section class="card error-box" role="alert">
        <h2>Erro ao carregar o catálogo</h2>
        <p>${esc(error?.message ?? 'Erro desconhecido.')}</p>
      </section>
    </main>`;
}
