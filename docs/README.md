# Documentação do projeto FanVerse

Este documento reúne a visão geral do projeto, a arquitetura atual e a referência rápida para cada parte importante do repositório.

## 1. Visão geral

O FanVerse foi desenvolvido como uma plataforma de biblioteca e catálogo de fanfics, com uma base de regras de negócio em Java e uma experiência visual moderna em Vite.

A arquitetura foi organizada para separar:

- lógica de negócio em Java;
- front-end em Vite e HTML/CSS/JS;
- dados do catálogo em JSON;
- servidor API em Node/Express;
- documentação e manutenção em arquivos de suporte.

## 2. Objetivo do sistema

O projeto busca representar:

- coleções e arcos de histórias;
- representação de livros digitais e físicos;
- usuários e operações de empréstimo;
- compra e transação;
- catálogo visual com expansão ao longo do tempo;
- edição do catálogo pelo próprio site de forma segura;
- manutenção sem alterar a lógica Java original.

## 3. Estrutura atual

```text
FanVerse/
├── README.md
├── index.html
├── vite.config.js
├── package.json
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
├── dist/
├── out/
├── livros md/
│   └── README.md
└── .gitignore
```

## 4. Camadas do projeto

### 4.1 Camada Java
A lógica principal da biblioteca está em `src/`.

Ela contém as classes de domínio e as regras do sistema, como:

- `Livro` e subclasses;
- `Usuario`;
- `Biblioteca`;
- `Catalogo`;
- `Colecao`;
- `Compra`;
- `Principal`.

### 4.2 Camada Vite / Front-end
A interface moderna e responsiva do projeto foi migrada para Vite e está concentrada nos arquivos:

- `index.html`
- `src/main.js`
- `src/style.css`

Essa camada é a responsável por renderizar o catálogo, o painel de destaque e o editor de catálogo.

### 4.3 Camada de dados
A base de dados do front-end do catálogo fica em:

- `data/catalogo.json`

Esse arquivo guarda as coleções, arcos e livros oferecidos pela interface.

### 4.4 Camada de servidor
O servidor Express em `server.js` expõe endpoints para recuperar e salvar o catálogo.

## 5. Fluxo de uso

1. O Java representa a estrutura de negócio e as regras do sistema.
2. O front-end em Vite exibe os dados do catálogo em uma interface premium.
3. O usuário pode adicionar itens pela própria página.
4. O navegador salva as alterações localmente em `localStorage` ou um backend JSON, sem tocar no código Java.
5. O projeto continua pronto para evoluir com API real, banco de dados ou deploy em Vercel.

## 6. Como rodar

### Front-end

```bash
npm install
npm run dev
```

### Build de produção

```bash
npm run build
```

### Servidor Node

```bash
npm start
```

### Java

```bash
javac -d out $(find src -name "*.java")
java -cp out principal.Principal
```

## 7. Documentação complementar

- Documentação detalhada por arquivo: [documentacao-arquivos.md](documentacao-arquivos.md)
- Visão geral do repositório: [../README.md](../README.md)

## 8. Conclusão

O FanVerse funciona como um exemplo completo de arquitetura em camadas, unindo domínio Java, front-end web e dados dinâmicos. Ele foi pensado para ser fácil de entender, revisar e evoluir em projetos acadêmicos ou demonstrações de portfolio.
