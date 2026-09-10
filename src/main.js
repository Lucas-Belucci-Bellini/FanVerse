import './style.css';

const catalogUrl = '/data/catalogo.json';

const app = document.querySelector('#app');

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(value);

async function loadCatalog() {
  const response = await fetch(catalogUrl);
  if (!response.ok) {
    throw new Error('Não foi possível carregar o catálogo.');
  }
  return response.json();
}

function buildCatalogView(data) {
  const allBooks = data.collections.flatMap((collection) =>
    collection.arcs.flatMap((arc) =>
      arc.books.map((book) => ({
        ...book,
        collectionTitle: collection.title,
        arcTitle: arc.title,
      }))
    )
  );

  return `
    <header class="topbar">
      <div class="container navbar">
        <div class="brand">FanVerse</div>
        <nav class="nav-links">
          <a href="#">Início</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#editor">Editar catálogo</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <div>
          <span class="tag">Coleções em crescimento</span>
          <h1>${allBooks[0]?.title || 'FanVerse'}</h1>
          <p>Biblioteca digital, coleção de fanfics e uma base pronta para expandir em Vite e Vercel.</p>
          <div class="hero-actions">
            <a class="button" href="#catalogo">Ver catálogo</a>
            <a class="button button-secondary" href="#editor">Atualizar catálogo</a>
          </div>
        </div>
      </section>

      <section id="catalogo" class="section">
        <h2>Catálogo</h2>
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

      <section id="editor" class="section editor-block">
        <h2>Editar catálogo no site</h2>
        <p>Essa edição fica no JSON do catálogo e não mexe no código Java original em <strong>src/</strong>.</p>

        <form id="catalog-form">
          <label>
            Título do livro
            <input type="text" id="book-title" placeholder="Ex.: Novo livro" required />
          </label>
          <label>
            Coleção
            <input type="text" id="book-collection" placeholder="Ex.: Crônicas da Baluarte" required />
          </label>
          <label>
            Descrição
            <textarea id="book-description" rows="4" required></textarea>
          </label>
          <label>
            Preço
            <input type="number" id="book-price" min="0" step="0.01" value="19.99" required />
          </label>
          <button type="submit" class="button">Salvar no catálogo</button>
        </form>
      </section>
    </main>
  `;
}

async function init() {
  try {
    const data = await loadCatalog();
    app.innerHTML = buildCatalogView(data);

    const form = document.querySelector('#catalog-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const title = document.querySelector('#book-title').value.trim();
      const collectionTitle = document.querySelector('#book-collection').value.trim();
      const description = document.querySelector('#book-description').value.trim();
      const price = Number(document.querySelector('#book-price').value);

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
        content: 'Conteúdo adicionado diretamente pelo site. Este texto foi escrito no catálogo dinâmico e não altera a lógica Java original.'
      };

      const updated = {
        ...data,
        collections: data.collections.map((collection) => {
          if (collection.title.toLowerCase() === collectionTitle.toLowerCase()) {
            return {
              ...collection,
              arcs: collection.arcs.map((arc, index) => {
                if (index === 0) {
                  return {
                    ...arc,
                    books: [...arc.books, newBook],
                  };
                }
                return arc;
              }),
            };
          }
          return collection;
        }),
      };

      const response = await fetch('/api/catalogo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar o catálogo.');
      }

      const result = await response.json();
      alert(result.message || 'Catálogo atualizado com sucesso!');
      window.location.reload();
    });
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
