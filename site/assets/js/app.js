const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(value);

const readParam = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

const statusClassMap = {
  'Ler agora': 'available',
  'Em breve': 'coming',
  'Indisponível': 'unavailable',
  'Digital': 'digital'
};

const renderHome = () => {
  const featured = allBooks.slice(0, 3);
  const collections = siteData.collections.slice(0, 3);

  document.getElementById('featured-books').innerHTML = featured.map((book) => `
    <article class="card">
      <img class="cover" src="${book.cover}" alt="${book.title}">
      <div class="card-body">
        <div class="meta-row">
          <span>${book.arcTitle}</span>
          <span>${book.year}</span>
        </div>
        <h3>${book.title}</h3>
        <p>${book.description}</p>
        <div class="card-actions">
          <a class="button small-button" href="livro.html?id=${book.id}">Ler</a>
          <a class="button-secondary small-button" href="catalogo.html">Catálogo</a>
        </div>
      </div>
    </article>
  `).join('');

  document.getElementById('collection-cards').innerHTML = collections.map((collection) => `
    <article class="card">
      <img class="cover" src="${collection.cover}" alt="${collection.title}">
      <div class="card-body">
        <div class="meta-row">
          <span>${collection.arcs.length} arcos</span>
          <span>${collection.author}</span>
        </div>
        <h3>${collection.title}</h3>
        <p>${collection.description}</p>
        <div class="card-actions">
          <a class="button small-button" href="colecao.html?id=${collection.id}">Ver coleção</a>
        </div>
      </div>
    </article>
  `).join('');

  const primaryBook = featured[0];
  document.getElementById('hero-book').textContent = primaryBook.title;
  document.getElementById('hero-collection').textContent = primaryBook.collectionTitle;
  document.getElementById('hero-author').textContent = siteData.author.name;
  document.querySelector('.hero-art img').src = primaryBook.cover;
};

const renderCatalogo = () => {
  const input = document.getElementById('catalog-search');
  const typeFilter = document.getElementById('tipo-filtro');
  const statusFilter = document.getElementById('status-filtro');
  const container = document.getElementById('catalog-list');

  const filterBooks = () => {
    const query = (input?.value || '').toLowerCase();
    const type = typeFilter?.value || 'todos';
    const status = statusFilter?.value || 'todos';

    let filtered = allBooks.filter((book) => {
      const matchesText = [book.title, book.collectionTitle, book.arcTitle, book.description].join(' ').toLowerCase().includes(query);
      const matchesType = type === 'todos' || book.type === type;
      const matchesStatus = status === 'todos' || book.availability === status;
      return matchesText && matchesType && matchesStatus;
    });

    container.innerHTML = filtered.map((book) => `
      <article class="card">
        <img class="cover" src="${book.cover}" alt="${book.title}">
        <div class="card-body">
          <div class="meta-row">
            <span>${book.collectionTitle}</span>
            <span>${book.year}</span>
          </div>
          <h3>${book.title}</h3>
          <p>${book.description}</p>
          <div class="meta-row">
            <span class="status ${statusClassMap[book.status] || 'digital'}">${book.status}</span>
            <span class="price">${formatCurrency(book.price)}</span>
          </div>
          <div class="card-actions">
            <a class="button small-button" href="livro.html?id=${book.id}">Ler</a>
            <a class="button-secondary small-button" href="livro.html?id=${book.id}">Detalhes</a>
          </div>
        </div>
      </article>
    `).join('') || '<p class="lead">Nenhum livro encontrado para os filtros atuais.</p>';
  };

  input?.addEventListener('input', filterBooks);
  typeFilter?.addEventListener('change', filterBooks);
  statusFilter?.addEventListener('change', filterBooks);
  filterBooks();
};

const renderCollection = () => {
  const id = readParam('id');
  const collection = getCollectionById(id) || siteData.collections[0];
  if (!collection) return;

  const totalBooks = collection.arcs.reduce((sum, arc) => sum + arc.books.length, 0);
  document.getElementById('collection-title').textContent = collection.title;
  document.getElementById('collection-description').textContent = collection.description;
  document.getElementById('collection-cover').src = collection.cover;
  document.getElementById('collection-meta').innerHTML = `
    <span>${collection.author}</span>
    <span>${collection.arcs.length} arcos</span>
    <span>${totalBooks} livros</span>
  `;

  document.getElementById('arc-list').innerHTML = collection.arcs.map((arc) => `
    <div class="arc-item">
      <div class="arc-item-header">
        <strong>${arc.title}</strong>
        <span class="status ${statusClassMap[arc.status] || 'digital'}">${arc.status}</span>
      </div>
      <p class="lead">${arc.description}</p>
      <ul class="list-inline">
        ${arc.books.map((book) => `<li><a href="livro.html?id=${book.id}">${book.title}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');
};

const renderLivro = () => {
  const id = readParam('id');
  const book = getBookById(id) || allBooks[0];
  if (!book) return;

  document.getElementById('book-title').textContent = book.title;
  document.getElementById('book-meta').textContent = `${book.collectionTitle} • ${book.arcTitle} • ${book.year}`;
  document.getElementById('book-description').textContent = book.description;
  document.getElementById('book-cover').src = book.cover;
  document.getElementById('book-price').textContent = formatCurrency(book.price);
  document.getElementById('book-status').textContent = book.status;
  document.getElementById('book-status').className = `status ${statusClassMap[book.status] || 'digital'}`;
  document.getElementById('book-availability').textContent = book.availability;
  document.getElementById('buy-link').href = `leitor.html?id=${book.id}`;
  document.getElementById('read-link').href = `leitor.html?id=${book.id}`;
};

const renderLoja = () => {
  const container = document.getElementById('shop-grid');
  container.innerHTML = allBooks.map((book) => `
    <article class="card">
      <img class="cover" src="${book.cover}" alt="${book.title}">
      <div class="card-body">
        <div class="meta-row">
          <span>${book.collectionTitle}</span>
          <span>${book.type}</span>
        </div>
        <h3>${book.title}</h3>
        <p>${book.status}</p>
        <div class="meta-row">
          <span class="price">${formatCurrency(book.price)}</span>
          <span class="status ${statusClassMap[book.status] || 'digital'}">${book.availability}</span>
        </div>
        <div class="card-actions">
          <a class="button small-button" href="livro.html?id=${book.id}">Detalhes</a>
        </div>
      </div>
    </article>
  `).join('');
};

const renderAutor = () => {
  const author = siteData.author;
  document.getElementById('author-name').textContent = author.name;
  document.getElementById('author-bio').textContent = author.bio;
  document.getElementById('author-location').textContent = author.location;
  document.getElementById('author-specialty').textContent = author.specialty;
  document.getElementById('author-photo').src = author.photo;
};

const renderLeitor = () => {
  const id = readParam('id');
  const book = getBookById(id) || allBooks[0];
  if (!book) return;

  document.getElementById('reader-title').textContent = book.title;
  document.getElementById('reader-subtitle').textContent = `${book.collectionTitle} • ${book.arcTitle}`;
  document.getElementById('reader-text').textContent = book.content;
  document.getElementById('reader-back').href = `livro.html?id=${book.id}`;
  document.getElementById('chapter-prev').href = `livro.html?id=${book.id}`;
  document.getElementById('chapter-next').href = `livro.html?id=${book.id}`;
};

const initThemeToggle = () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const apply = (theme) => {
    document.body.classList.toggle('light', theme === 'light');
    toggle.textContent = theme === 'light' ? 'Modo escuro' : 'Modo claro';
    localStorage.setItem('fanverse-theme', theme);
  };

  const saved = localStorage.getItem('fanverse-theme');
  if (saved) apply(saved);

  toggle.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    apply(next);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();

  const page = document.body.dataset.page;
  if (page === 'home') renderHome();
  if (page === 'catalogo') renderCatalogo();
  if (page === 'colecao') renderCollection();
  if (page === 'livro') renderLivro();
  if (page === 'loja') renderLoja();
  if (page === 'autor') renderAutor();
  if (page === 'leitor') renderLeitor();
});
