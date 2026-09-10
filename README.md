# FanVerse

FanVerse é um projeto completo que combina duas camadas bem separadas:

- uma base de domínio em Java para biblioteca, usuários, compras, coleções e catálogo;
- uma interface web moderna em Vite para apresentar e atualizar o catálogo pelo próprio site.

A ideia central é manter a lógica de negócio em Java intacta e usar a camada web como uma visão visual e interativa dos dados, sem mexer no código original da biblioteca.

## Visão geral

O projeto foi pensado para funcionar como base para:

- organização de livros e coleções;
- controle de até 50 itens no catálogo;
- livros digitais e físicos;
- usuários e empréstimos;
- compras e transações;
- apresentação premium em front-end web;
- edição do catálogo pela própria interface do site sem afetar o código Java.

## Estrutura atual do projeto

```text
FanVerse/
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── server.js
├── .gitignore
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
│   ├── livros/
│   │   ├── CodigoLivro.java
│   │   ├── Livro.java
│   │   ├── LivroDigital.java
│   │   └── LivroFisico.java
│   ├── principal/
│   │   └── Principal.java
│   ├── usuarios/
│   │   └── Usuario.java
│   └── ...
├── site/
│   ├── README.md
│   ├── index.html
│   ├── catalogo.html
│   ├── colecao.html
│   ├── livro.html
│   ├── loja.html
│   ├── leitor.html
│   ├── autor.html
│   └── assets/
├── docs/
│   ├── README.md
│   └── documentacao-arquivos.md
├── out/
├── dist/
├── node_modules/
├── livros md/
│   └── README.md
└── ...
```

## Arquitetura do projeto

### Camada Java
A pasta `src/` contém a lógica de negócio da biblioteca, incluindo:

- livros e subclasses;
- usuários;
- biblioteca;
- catálogo;
- coleções;
- compras.

### Camada web
A interface visual atual é montada em Vite e fica na pasta raiz com `index.html`, `src/main.js` e `src/style.css`.

### Camada de dados
Os dados do catálogo ficam em `data/catalogo.json`, que pode ser usado pela interface e por uma API ou persistência futura.

### Camada de servidor
O arquivo `server.js` expõe API REST simples para carregar e atualizar o catálogo.

## Como rodar o projeto

### Instalar dependências

```bash
npm install
```

### Rodar o front-end em desenvolvimento

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

### Rodar a API/servidor

```bash
npm start
```

### Executar a lógica Java

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

## Regras importantes da arquitetura

- O código Java permanece como domínio e regra de negócio.
- O site não deve sobrescrever classes Java ou alterar o modelo de negócios original.
- O catálogo do front-end pode ser atualizado por `localStorage` ou por um backend JSON sem mexer na lógica Java.
- Esta separação facilita manutenção, apresentação acadêmica e extensão do projeto.

## Documentação detalhada

- Documentação geral: [docs/README.md](docs/README.md)
- Descrição arquivo a arquivo: [docs/documentacao-arquivos.md](docs/documentacao-arquivos.md)

## Observações finais

Este projeto funciona como exemplo prático de:

- orientação a objetos em Java;
- arquitetura em camadas;
- front-end moderno com Vite;
- apresentação de catálogo e coleções;
- atualização segura do catálogo sem alterar o sistema principal.

Ele pode ser usado como base para atividades acadêmicas, portfólio, apresentação e extensões futuras.
