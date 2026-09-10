const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_PATH = path.join(ROOT, 'data', 'catalogo.json');

app.use(express.json());
app.use('/assets', express.static(path.join(ROOT, 'site', 'assets')));
app.use(express.static(path.join(ROOT, 'site')));

const readCatalog = () => {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
};

app.get('/api/catalogo', (req, res) => {
  try {
    const data = readCatalog();
    res.json(data);
  } catch (error) {
    console.error('Erro ao ler catálogo:', error);
    res.status(500).json({ message: 'Erro ao carregar catálogo.' });
  }
});

app.get('/api/catalogo/books', (req, res) => {
  try {
    const data = readCatalog();
    const books = data.collections.flatMap((collection) =>
      collection.arcs.flatMap((arc) => arc.books.map((book) => ({
        ...book,
        collectionId: collection.id,
        collectionTitle: collection.title,
        arcId: arc.id,
        arcTitle: arc.title
      })))
    );
    res.json(books);
  } catch (error) {
    console.error('Erro ao listar livros:', error);
    res.status(500).json({ message: 'Erro ao listar livros.' });
  }
});

app.get('/api/catalogo/book/:id', (req, res) => {
  const books = readCatalog().collections.flatMap((collection) =>
    collection.arcs.flatMap((arc) => arc.books.map((book) => ({
      ...book,
      collectionId: collection.id,
      collectionTitle: collection.title,
      arcId: arc.id,
      arcTitle: arc.title
    })))
  );

  const book = books.find((item) => item.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Livro não encontrado.' });
  }

  return res.json(book);
});

app.get('/api/catalogo/collection/:id', (req, res) => {
  const data = readCatalog();
  const collection = data.collections.find((item) => item.id === req.params.id);
  if (!collection) {
    return res.status(404).json({ message: 'Coleção não encontrada.' });
  }
  return res.json(collection);
});

app.get('*', (req, res) => {
  const safePath = req.path === '/' ? '/index.html' : req.path;
  const filePath = path.join(ROOT, 'site', safePath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(ROOT, 'site', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`FanVerse server running at http://localhost:${PORT}`);
});
