# FanVerse

FanVerse é um projeto de biblioteca e catálogo de histórias. O repositório reúne a parte em Java, usada para representar as classes do sistema, e a parte web, usada para mostrar e editar o catálogo.

A ideia é manter cada parte com uma função clara: o Java modela as regras da biblioteca (projeto acadêmico), e a web — frontend Vite + API Express — publica e edita o catálogo. Hoje as duas partes são **independentes**: o Java não lê nem grava os dados da web.

## O que existe no projeto

Hoje o projeto tem:

- no **Java**: livros digitais e físicos, usuários e empréstimos, biblioteca, catálogo com limite de
  50 livros, coleções e registro de compras (tudo em memória, com testes);
- na **web**: catálogo em JSON (autor → coleções → arcos → livros), interface feita com Vite e
  servidor Node/Express que valida e grava o catálogo;
- testes automatizados e CI no GitHub Actions.

## Estrutura principal

```text
FanVerse/
├── index.html · vite.config.js · package.json
├── server.js              # inicia o servidor (variáveis de ambiente)
├── server/                # API Express: rotas, gravação do JSON, erros
├── shared/catalog.js      # contrato do catálogo (usado pela API e pelo frontend)
├── data/catalogo.json     # catálogo — fonte de verdade
├── src/
│   ├── main.js · style.css · app/   # frontend Vite (interface principal)
│   └── biblioteca/ catalogo/ colecoes/ compras/ livros/ principal/ usuarios/   # Java
├── site/                  # site estático legado (congelado; dados gerados do JSON)
├── scripts/               # validação de dados, geração do site/, runner Java
├── test/                  # testes JS (node --test) e test/java/ (Java)
├── docs/                  # STATUS, AUDIT, ARCHITECTURE, DATA_MODEL, API, DEVELOPMENT, DECISIONS, ROADMAP
└── .github/workflows/ci.yml
```

## Como as partes se relacionam

- **Java** — as classes em `src/` modelam a biblioteca (`Livro` e suas especializações, `Usuario`,
  `Catalogo` com limite de 50 livros, `Colecao`, `Compra`). Rodam sozinhas e **não** alimentam a web.
- **Frontend Vite** — `index.html` + `src/main.js` + `src/app/`: mostra o catálogo e permite adicionar
  livros. Lê da API; sem API, usa o catálogo embutido no build e guarda edições no navegador, avisando.
- **API** — `server.js` + `server/`: lê e grava `data/catalogo.json`, validando cada gravação.
- **Dados** — `data/catalogo.json` (autor → coleções → arcos → livros) é a única fonte;
  o contrato está em [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md).
- **Site legado** — `site/` tem 7 páginas estáticas (catálogo, coleção, livro, leitor, loja, autor),
  servidas em `/site/`.

## Como executar

Requisitos: Node 20+ e, para o Java, JDK 17+.

```bash
npm ci              # instalar dependências
npm run dev:api     # terminal 1 — API em http://127.0.0.1:3000
npm run dev         # terminal 2 — frontend em http://localhost:5173
```

```bash
npm run build && npm start   # "produção" local: tudo em http://127.0.0.1:3000
npm run java:run             # executa o exemplo Java (Windows, Linux e macOS)
npm run verify               # testes JS + build + testes Java
```

Todos os comandos, variáveis de ambiente e o fluxo de testes: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## API do catálogo

```text
GET  /api/health
GET  /api/catalogo                 # catálogo completo (+ ETag)
PUT  /api/catalogo                 # substitui o catálogo (validado; protegido)
GET  /api/catalogo/books
GET  /api/catalogo/book/:id
GET  /api/catalogo/collection/:id
```

O `PUT` valida o catálogo inteiro e só aceita escrita da própria máquina, ou com
`FANVERSE_ADMIN_TOKEN` quando configurado. Detalhes, erros e exemplos: [`docs/API.md`](docs/API.md).

## Documentação

Índice completo em [`docs/README.md`](docs/README.md). Para saber o estado atual, comece por
[`docs/STATUS.md`](docs/STATUS.md); a descrição arquivo por arquivo está em
[`docs/documentacao-arquivos.md`](docs/documentacao-arquivos.md).
