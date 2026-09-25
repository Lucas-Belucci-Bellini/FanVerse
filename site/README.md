# FanVerse — site

A pasta `site/` reúne as páginas HTML do site e os arquivos estáticos usados por elas.

Essa parte é separada do front-end Vite que fica na raiz do projeto.

## Páginas

```text
site/
├── index.html
├── catalogo.html
├── colecao.html
├── livro.html
├── leitor.html
├── loja.html
├── autor.html
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        └── data.js
```

## Para que serve cada página

| Arquivo | Função |
|---|---|
| `index.html` | Página inicial |
| `catalogo.html` | Lista de livros e filtros |
| `colecao.html` | Informações de uma coleção e seus arcos |
| `livro.html` | Detalhes de um livro |
| `leitor.html` | Tela de leitura |
| `loja.html` | Área de compra apresentada pelo site |
| `autor.html` | Informações do autor |

## JavaScript

`assets/js/data.js` guarda os dados usados pelo site estático. **É gerado** a partir de `data/catalogo.json` com `npm run sync:site-data` — não edite à mão (um teste falha se ficar desatualizado).

`assets/js/app.js` usa esses dados para preencher as páginas, montar cards e controlar parte da navegação e dos filtros.

## CSS

`assets/css/style.css` concentra os estilos das páginas dessa pasta. O arquivo contém as regras de layout, cards, navegação, leitor e ajustes para telas menores.

## Como testar

Pode ser aberto por um servidor local simples:

```bash
python -m http.server 8000
```

Depois:

```text
http://localhost:8000/site/
```

Com o servidor do projeto (`npm start`), o site fica em `http://localhost:3000/site/`. Links antigos na raiz (`/catalogo.html`) redirecionam para lá.

## Observação

Essa pasta não é a mesma coisa que o front-end Vite da raiz, que é a interface principal. O `site/` está **congelado** (DEC-006): serve de referência de produto para portar leitor, loja e autor ao Vite, e não recebe funcionalidade nova.
