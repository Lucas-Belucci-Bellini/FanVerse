# Documentação do FanVerse

Esta pasta reúne a documentação do projeto. A ideia aqui é explicar como o repositório está organizado e o que cada parte faz, sem transformar a documentação em um texto muito formal.

## 1. Visão geral

O FanVerse reúne uma parte em Java e uma parte web.

A parte Java contém as classes usadas para representar livros, usuários, biblioteca, catálogo, coleções e compras.

A parte web mostra o catálogo no navegador. Ela usa JavaScript, CSS, JSON, Vite e um servidor Express.

## 2. Principais partes

### Java

A estrutura principal está em `src/`.

Entre as classes estão:

- `Livro`: classe base dos livros;
- `LivroDigital`: livro digital;
- `LivroFisico`: livro físico;
- `CodigoLivro`: código interno criado para o livro;
- `Usuario`: usuário da biblioteca;
- `Biblioteca`: registra empréstimos e compras;
- `Catalogo`: adiciona, remove e procura livros;
- `Colecao`: agrupa livros;
- `ColecaoLivros`: versão da coleção com limite de 50 livros;
- `Compra`: representa uma compra;
- `Principal`: executa os exemplos do sistema.

### Front-end Vite

A interface atual usa principalmente:

- `index.html` como entrada;
- `src/main.js` para montar a interface e trabalhar com o catálogo;
- `src/style.css` para o visual.

O `main.js` procura primeiro dados salvos no navegador. Depois tenta a API e, caso não consiga, tenta carregar `data/catalogo.json`. Também existe um catálogo de fallback dentro do próprio JavaScript.

### Dados

`data/catalogo.json` guarda o catálogo usado pelo site.

A estrutura atual possui:

```text
author
collections
  └── arcs
       └── books
```

Cada livro possui, entre outros campos, título, descrição, tipo, preço, status, ano, quantidade de capítulos, capa e conteúdo.

### Servidor

`server.js` usa Express.

Ele:

- disponibiliza arquivos do site;
- entrega o catálogo pela API;
- recebe alterações no catálogo;
- procura livros por ID;
- procura coleções por ID.

## 3. Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/catalogo` | Retorna o catálogo completo |
| PUT | `/api/catalogo` | Salva um catálogo recebido |
| GET | `/api/catalogo/books` | Lista todos os livros |
| GET | `/api/catalogo/book/:id` | Retorna um livro pelo ID |
| GET | `/api/catalogo/collection/:id` | Retorna uma coleção pelo ID |

## 4. Estrutura de pastas

```text
FanVerse/
├── data/
│   └── catalogo.json
├── src/
│   ├── biblioteca/
│   ├── catalogo/
│   ├── colecoes/
│   ├── compras/
│   ├── livros/
│   ├── principal/
│   ├── usuarios/
│   ├── main.js
│   └── style.css
├── site/
│   └── páginas HTML e arquivos estáticos
├── docs/
│   ├── README.md
│   └── documentacao-arquivos.md
├── index.html
├── package.json
├── server.js
└── vite.config.js
```

## 5. Como executar

### Front-end

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Servidor

```bash
npm start
```

### Java

Linux/macOS:

```bash
javac -d out $(find src -name "*.java")
java -cp out principal.Principal
```

Windows PowerShell:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
java -cp out principal.Principal
```

## 6. O que a execução do Java demonstra

O arquivo `Principal.java` cria exemplos de livros, usuário, biblioteca, coleção, catálogo e compra.

Também são executados exemplos de:

- métodos sobrecarregados;
- herança entre `Livro` e suas subclasses;
- polimorfismo usando `Livro[]`;
- empréstimo;
- `toString()`;
- getters e setters;
- limite de 50 livros no catálogo;
- registro de compra.

Esses exemplos estão no código para facilitar a execução e a conferência do funcionamento das classes.

## 7. Estado atual e limitações

Algumas partes ainda são simples e podem ser melhoradas depois.

O catálogo do Java fica em memória durante a execução. Já o catálogo do site usa JSON e `localStorage`.

A compra representada no site não é um sistema de pagamento real. O servidor apenas registra os dados recebidos.

A interface em `site/` é separada da interface principal em Vite. Por isso, mudanças feitas em uma parte não significam necessariamente mudanças na outra.

## 8. Documentação por arquivo

Para consultar a função de cada arquivo principal, use [`documentacao-arquivos.md`](documentacao-arquivos.md).
