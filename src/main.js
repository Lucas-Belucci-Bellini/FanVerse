import './style.css';

const STORAGE_KEY = 'fanverse-catalog-local';
const FALLBACK_CATALOG = {
  author: {
    name: 'Lucas Belucci Bellini',
    bio: 'Autor, organizador de coleções e criador do universo FanVerse.',
    location: 'São Paulo, Brasil',
    specialty: 'Fanfiction e séries literárias',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  collections: [
    {
      id: 'cronicas-da-baluarte',
      title: 'Crônicas da Baluarte',
      description: 'Uma saga épica de mistério, coragem e alianças.',
      author: 'Lucas Belucci Bellini',
      year: 2024,
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
      arcs: [
        {
          id: 'arco-01',
          number: 1,
          title: 'Arco 01 — O Portão de Pedra',
          description: 'O início da jornada marcada por escolha e mistério.',
          status: 'Disponível',
          books: [
            {
              id: 'baluarte-01',
              title: 'Livro 01 — O Portão de Pedra',
              description: 'A cidade acorda para a primeira grande ameaça.',
              type: 'digital',
              price: 9.9,
              status: 'Ler agora',
              availability: 'DIGITAL_DISPONIVEL',
              year: 2024,
              chapters: 12,
              cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
              content: 'A cidade de Baluarte ainda guardava as marcas do último inverno, quando a ponte de pedra começou a vibrar.'
            },
            {
              id: 'baluarte-02',
              title: 'Livro 02 — A Sombra dos Vales',
              description: 'Os protagonistas entram em territórios desconhecidos.',
              type: 'digital',
              price: 12.9,
              status: 'Ler agora',
              availability: 'DIGITAL_DISPONIVEL',
              year: 2024,
              chapters: 11,
              cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
              content: 'Os vales tinham fama de serem antigos demais para guardar segredos.'
            }
          ]
        }
      ]
    }
  ]
};

const app = document.querySelector('#app');

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(value);

function getAllBooks(data) {
  return data.collections.flatMap((collection) =>
    collection.arcs.flatMap((arc) =>
      arc.books.map((book) => ({
        ...book,
        collectionTitle: collection.title,
        arcTitle: arc.title,
      }))
    )
  );
}

async function loadCatalog() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.collections) {
        return parsed;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  try {
    const response = await fetch('/data/catalogo.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Arquivo de catálogo não encontrado.');
    }
    const data = await response.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_CATALOG));
    return FALLBACK_CATALOG;
  }
}

function buildCatalogView(data) {
  const allBooks = getAllBooks(data);
  const featured = allBooks.slice(0, 3);

  return `
    <div class="page-shell">
      <header class="topbar">
        <div class="container navbar">
          <div class="brand">FanVerse</div>
          <nav class="nav-links">
            <a href="#inicio">Início</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#editor">Editar</a>
          </nav>
        </div>
      </header>

      <main id="inicio" class="container main-content">
        <section class="hero panel-glass">
          <div class="hero-copy">
            <span class="tag">Coleções em crescimento</span>
            <h1>${featured[0]?.title || 'FanVerse'}</h1>
            <p>
              Biblioteca digital, fanfics, coleções em expansão e um front-end premium preparado para Vite e Vercel.
            </p>
            <div class="hero-actions">
              <a class="button" href="#catalogo">Ver catálogo</a>
              <a class="button button-secondary" href="#editor">Atualizar catálogo</a>
            </div>
          </div>
          <div class="hero-art">
            <div class="art-card">
              <img src="${featured[0]?.cover || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80'}" alt="Capa principal" />
            </div>
          </div>
        </section>

        <section class="metrics-row">
          <div class="metric-box">
            <strong>${allBooks.length}</strong>
            <span>livros</span>
          </div>
          <div class="metric-box">
            <strong>${data.collections.length}</strong>
            <span>coleções</span>
          </div>
          <div class="metric-box">
            <strong>Vite</strong>
            <span>pronto para Vercel</span>
          </div>
        </section>

        <section id="catalogo" class="section-block">
          <div class="section-head">
            <h2>Catálogo</h2>
            <span class="badge">Atualizações locais</span>
          </div>
          <div class="grid-3">
            ${allBooks.map((book) => `
              <article class="card">
                <img class="cover" src="${book.cover}" alt="${book.title}" />
                <div class="card-body">
                  <div class="meta-row">
                    <span>${book.collectionTitle}</span>
                    <span>${book.year}</span>
                  </div>
                  <h3>${book.title}</h3>
                  <p>${book.description}</p>
                  <div class="meta-row">
                    <span class="status available">${book.status}</span>
                    <span class="price">${formatCurrency(book.price)}</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <section id="editor" class="section-block editor-box">
          <div class="section-head">
            <h2>Editar catálogo no site</h2>
            <button type="button" id="reset-catalog" class="button button-secondary small">Resetar</button>
          </div>
          <p class="editor-note">
            As alterações ficam no navegador e não mexem no código Java em <strong>src/</strong>.
          </p>

          <form id="catalog-form" class="catalog-form">
            <label>
              Título do livro
              <input type="text" id="book-title" placeholder="Ex.: Novo título" required />
            </label>
            <label>
              Coleção
              <input type="text" id="book-collection" placeholder="Ex.: Crônicas da Baluarte" required />
            </label>
            <label>
              Descrição
              <textarea id="book-description" rows="4" placeholder="Descreva a obra..." required></textarea>
            </label>
            <label>
              Preço
              <input type="number" id="book-price" min="0" step="0.01" value="19.99" required />
            </label>
            <button type="submit" class="button">Salvar no catálogo</button>
          </form>
        </section>
      </main>
    </div>
  `;
}

function ensureCollection(data, collectionTitle) {
  const normalized = collectionTitle.trim().toLowerCase();
  let target = data.collections.find((collection) => collection.title.toLowerCase() === normalized);

  if (!target) {
    target = {
      id: `colecao-${Date.now()}`,
      title: collectionTitle.trim(),
      description: 'Nova coleção adicionada pelo editor do site.',
      author: data.author.name,
      year: new Date().getFullYear(),
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
      arcs: [
        {
          id: `arco-${Date.now()}`,
          number: 1,
          title: 'Arco 01 — Novo arco',
          description: 'Arco recém-criado pela edição do catálogo.',
          status: 'Disponível',
          books: []
        }
      ]
    };
    data.collections.push(target);
  }

  return target;
}

function saveCatalog(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  app.innerHTML = buildCatalogView(data);
  bindEvents(data);
}

function bindEvents(data) {
  const form = document.querySelector('#catalog-form');
  const resetButton = document.querySelector('#reset-catalog');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.querySelector('#book-title').value.trim();
    const collectionTitle = document.querySelector('#book-collection').value.trim();
    const description = document.querySelector('#book-description').value.trim();
    const price = Number(document.querySelector('#book-price').value);

    if (!title || !collectionTitle || !description || Number.isNaN(price)) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    const collection = ensureCollection(data, collectionTitle);
    const arc = collection.arcs[0];

    const newBook = {
      id: `novo-${Date.now()}`,
      title,
      description,
      type: 'digital',
      price,
      status: 'Ler agora',
      availability: 'DIGITAL_DISPONIVEL',
      year: new Date().getFullYear(),
      chapters: 1,
      cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
      content: 'Conteúdo adicionado diretamente pelo site. Isso atualiza o catálogo da interface e não modifica a lógica Java original.'
    };

    arc.books.push(newBook);
    saveCatalog(data);
    alert('Catálogo atualizado com sucesso no navegador.');
  });

  resetButton?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(FALLBACK_CATALOG));
    app.innerHTML = buildCatalogView(FALLBACK_CATALOG);
    bindEvents(FALLBACK_CATALOG);
  });
}

async function init() {
  try {
    const data = await loadCatalog();
    app.innerHTML = buildCatalogView(data);
    bindEvents(data);
  } catch (error) {
    app.innerHTML = `
      <main class="container">
        <section class="section">
          <div class="card error-box">
            <h2>Erro ao carregar o catálogo</h2>
            <p>${error.message}</p>
          </div>
        </section>
      </main>
    `;
  }
}

init();
