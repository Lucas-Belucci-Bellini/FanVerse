# FanVerse Site

Este diretório contém a base do site para a plataforma literária FanVerse.

## Objetivo
O site foi criado para apresentar:

- home com destaque para obras e coleções;
- catálogo com pesquisa e filtros;
- páginas de coleção e arco;
- página de livro;
- leitor digital;
- loja para produtos digitais e físicos;
- página do autor;
- arquitetura preparada para expansão futura.

## Estrutura

```text
site/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── data.js
├── index.html
├── catalogo.html
├── colecao.html
├── livro.html
├── leitor.html
├── loja.html
├── autor.html
└── README.md
```

## Como abrir
Abra qualquer arquivo HTML diretamente no navegador, ou use um servidor local simples, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/
```

## Como estender
- adicione novas coleções em `assets/js/data.js`;
- adicione novos livros dentro dos arcos das coleções;
- personalize os estilos em `assets/css/style.css`;
- mantenha a navegação conforme a estrutura dos arquivos HTML.

## Observações
- O site é uma base moderna e responsiva, preparada para crescer.
- A compra física é apenas representada no front-end como status futuro, sem simular um estoque real.
- A leitura usa conteúdo estático e é facilmente extensível para arquivos Markdown no futuro.
