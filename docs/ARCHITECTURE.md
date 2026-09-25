# FanVerse — Arquitetura Atual

## Visão geral

O repositório possui quatro áreas funcionais principais:

1. **Domínio Java**
2. **Frontend Vite**
3. **API Node/Express**
4. **Site estático legado/referência**

Há ainda uma camada de dados baseada em JSON.

## Diagrama lógico

```text
                         FanVerse
                            |
          +-----------------+-----------------+
          |                 |                 |
      Domínio Java      Aplicação Web      Site estático
          |                 |                 |
       src/*.java       Vite + JS/CSS     HTML + JS + CSS
          |                 |                 |
          |              API Express        data.js
          |                 |
          |          data/catalogo.json
          |
       memória
```

## Domínio Java

Pacotes principais:

- `livros`
- `usuarios`
- `biblioteca`
- `catalogo`
- `colecoes`
- `compras`
- `principal`

### Relações principais

```text
Livro
├── LivroDigital
└── LivroFisico

Usuario ──> empréstimo ──> Livro

Biblioteca
├── Usuario
├── empréstimo
└── Compra

Catalogo
└── vários Livro

Colecao
└── vários Livro

Compra
├── Usuario
└── Livro
```

## Frontend Vite

Arquivos centrais:

- `index.html`
- `src/main.js`
- `src/style.css`

Responsabilidades observadas:
- renderização da interface;
- leitura do catálogo;
- edição do catálogo;
- persistência local;
- comunicação com a API;
- fallback de dados.

## API

`server.js` usa Express.

Responsabilidades:
- servir arquivos;
- fornecer o catálogo;
- listar livros;
- buscar livro por ID;
- buscar coleção por ID;
- receber atualizações do catálogo.

## Persistência

A persistência web atual é baseada em arquivo JSON:

```text
Frontend
   |
   | GET/PUT
   v
Express
   |
   v
data/catalogo.json
```

O navegador também utiliza `localStorage` em determinados fluxos.

## Site estático

`site/` possui páginas independentes:
- início;
- catálogo;
- coleção;
- livro;
- leitor;
- loja;
- autor.

Ele possui seu próprio:
- `assets/js/data.js`;
- `assets/js/app.js`;
- `assets/css/style.css`.

## Limites arquiteturais atuais

Não assumir que:
- Java é backend da aplicação web;
- JSON é um banco de dados definitivo;
- `site/` e Vite são a mesma interface;
- compras atuais representam pagamentos reais;
- há autenticação;
- há persistência relacional.

Essas são decisões futuras.
