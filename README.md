# FanVerse

FanVerse é um projeto de biblioteca e catálogo de histórias. O repositório reúne a parte em Java, usada para representar as classes do sistema, e a parte web, usada para mostrar e editar o catálogo.

A ideia é manter cada parte com uma função clara: o Java cuida dos objetos e regras do sistema, enquanto o site cuida da apresentação dos dados.

## O que existe no projeto

Hoje o projeto tem:

- livros digitais e físicos;
- usuários e empréstimos;
- biblioteca;
- catálogo com limite de 50 livros;
- coleções;
- registro de compras;
- catálogo em JSON;
- interface web feita com Vite;
- servidor Node/Express para o catálogo.

## Estrutura principal

```text
FanVerse/
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── server.js
├── data/
│   └── catalogo.json
├── src/
│   ├── main.js
│   ├── style.css
│   ├── biblioteca/
│   │   ├── Biblioteca.java
│   │   └── Compra.java
│   ├── catalogo/
│   │   └── Catalogo.java
│   ├── colecoes/
│   │   ├── Colecao.java
│   │   └── ColecaoLivros.java
│   ├── compras/
│   │   └── Compra.java
│   ├── livros/
│   │   ├── CodigoLivro.java
│   │   ├── Livro.java
│   │   ├── LivroDigital.java
│   │   └── LivroFisico.java
│   ├── principal/
│   │   └── Principal.java
│   └── usuarios/
│       └── Usuario.java
├── site/
│   ├── index.html
│   ├── catalogo.html
│   ├── colecao.html
│   ├── livro.html
│   ├── loja.html
│   ├── leitor.html
│   ├── autor.html
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── README.md
├── docs/
│   ├── README.md
│   └── documentacao-arquivos.md
└── .gitignore
```

## Como as partes se relacionam

### Java

As classes dentro de `src/` representam o funcionamento da biblioteca. Por exemplo, `Livro` é a classe base, `LivroDigital` e `LivroFisico` são especializações, `Usuario` representa quem usa a biblioteca e `Catalogo` controla os livros cadastrados.

### Site Vite

`index.html`, `src/main.js` e `src/style.css` formam a interface principal atual. O JavaScript carrega os dados do catálogo, monta os cards e permite adicionar novos livros pelo formulário da página.

### Dados

`data/catalogo.json` guarda as informações usadas pelo site. A estrutura possui autor, coleções, arcos e livros.

### Servidor

`server.js` usa Express para disponibilizar o catálogo por uma API. Ele também pode salvar as alterações recebidas em `data/catalogo.json`.

## Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Abrir o front-end em desenvolvimento

```bash
npm run dev
```

### 3. Gerar a build

```bash
npm run build
```

### 4. Iniciar o servidor Node

```bash
npm start
```

### 5. Compilar e executar o Java

No Linux/macOS:

```bash
javac -d out $(find src -name "*.java")
java -cp out principal.Principal
```

No Windows PowerShell:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
java -cp out principal.Principal
```

## API do catálogo

O arquivo `server.js` possui estas rotas:

```text
GET  /api/catalogo
PUT  /api/catalogo
GET  /api/catalogo/books
GET  /api/catalogo/book/:id
GET  /api/catalogo/collection/:id
```

O `GET /api/catalogo` retorna o catálogo completo. O `PUT /api/catalogo` recebe um catálogo novo e salva o conteúdo no arquivo JSON.

## Observações

O projeto possui duas partes web diferentes no repositório: a interface Vite atual e o conjunto de páginas HTML em `site/`. A pasta `site/` serve como base de páginas estáticas e referência do layout.

As alterações feitas pelo editor da interface são mantidas no `localStorage` do navegador e, quando a API está disponível, também podem ser enviadas para o servidor. Isso não altera diretamente as classes Java.

## Documentação

A documentação da estrutura está em [`docs/README.md`](docs/README.md).

A descrição dos arquivos está em [`docs/documentacao-arquivos.md`](docs/documentacao-arquivos.md).
