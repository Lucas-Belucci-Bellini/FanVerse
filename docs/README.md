# Documentação do projeto FanVerse

Este documento centraliza a explicação do projeto para facilitar manutenção, debug, reutilização e apresentação em atividades acadêmicas.

## 1. Visão geral

O FanVerse é um projeto que mistura duas ideias:

- uma base Java orientada a objetos para biblioteca, catálogo, usuários, compras e coleções;
- um site front-end para apresentar obras, coleções, loja e leitura.

A estrutura foi pensada para manter a lógica de negócio em Java e separar a parte visual da parte de dados.

## 2. Objetivo do projeto

O sistema busca representar:

- livros digitais e físicos;
- usuários e empréstimos;
- compras;
- coleção de obras por temática;
- catálogo com capacidade para até 50 itens;
- página web para vender e exibir a biblioteca.

## 3. Estrutura principal

```text
FanVerse/
├── README.md
├── docs/
│   ├── README.md
│   └── documentacao-arquivos.md
├── data/
│   └── catalogo.json
├── site/
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── app.js
│   │       └── data.js
│   ├── autor.html
│   ├── catalogo.html
│   ├── colecao.html
│   ├── index.html
│   ├── leitor.html
│   ├── livro.html
│   ├── loja.html
│   └── README.md
├── src/
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
├── package.json
├── server.js
├── out/
├── livros md/
│   └── README.md
└── README.md
```

## 4. Arquitetura lógica

### Camada Java

A pasta [src](../src) contém a lógica principal do sistema. Ela usa conceitos de POO:

- encapsulamento;
- herança;
- polimorfismo;
- composição;
- agregação;
- associação;
- coleções Java.

### Camada web

A pasta [site](../site) contém as páginas HTML, estilos CSS e scripts JavaScript. Ela apresenta os dados em uma interface amigável e responsiva.

### Camada de dados

A pasta [data](../data) contém o arquivo [data/catalogo.json](../data/catalogo.json), que é a base de dados do catálogo do site.

## 5. Como reutilizar o código

### Reuso em Java

- [src/livros/Livro.java](../src/livros/Livro.java) pode ser reutilizado como modelo base para qualquer sistema de biblioteca.
- [src/livros/LivroDigital.java](../src/livros/LivroDigital.java) e [src/livros/LivroFisico.java](../src/livros/LivroFisico.java) mostram como estender uma classe base.
- [src/catalogo/Catalogo.java](../src/catalogo/Catalogo.java) pode ser adaptado para qualquer catálogo de produtos, músicas, artigos ou itens de coleção.
- [src/biblioteca/Biblioteca.java](../src/biblioteca/Biblioteca.java) é útil para sistemas com associação de usuários e movimentações.

### Reuso em front-end

- [site/assets/js/app.js](../site/assets/js/app.js) pode servir como base para páginas dinâmicas em outras aplicações.
- [site/assets/css/style.css](../site/assets/css/style.css) contém estilos reutilizáveis para cards, botões, hero section e layout responsivo.
- [site/assets/js/data.js](../site/assets/js/data.js) pode ser trocado por uma API real em projetos futuros.

## 6. Como rodar o projeto

### Java

No terminal da pasta do projeto:

```bash
javac -d out $(find src -name "*.java")
java -cp out principal.Principal
```

### Front-end local

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/
```

## 7. O que cada camada representa

### Java

Representa o sistema de negócio e regras de domínio.

### HTML

Representa a estrutura das páginas e conteúdo visual.

### CSS

Representa o visual, tema, responsividade e layout.

### JavaScript

Representa interatividade e renderização dinâmica dos dados.

## 8. Observações importantes

- A lógica Java não deve ser alterada para dar suporte ao front-end visual.
- O catálogo do site deve ser considerado como uma camada separada e paralela ao sistema em Java.
- Esta separação é útil para projetos acadêmicos, porque deixa o entendimento mais claro e evita acoplamento.

## 9. Sugestões de extensão

- adicionar login e controle de usuários;
- criar banco de dados real;
- converter o catálogo para API REST;
- integrar Java com JSON ou banco;
- criar página de administração para editar catálogo.

## 10. Arquivos mais importantes para estudo

Se você quiser revisar os pontos principais do projeto, comece por:

1. [src/livros/Livro.java](../src/livros/Livro.java)
2. [src/catalogo/Catalogo.java](../src/catalogo/Catalogo.java)
3. [src/principal/Principal.java](../src/principal/Principal.java)
4. [site/index.html](../site/index.html)
5. [site/assets/js/app.js](../site/assets/js/app.js)
6. [site/assets/css/style.css](../site/assets/css/style.css)

## 11. Conclusão

Este projeto funciona como um bom exemplo de como combinar:

- programação orientada a objetos em Java;
- estrutura de site front-end em HTML, CSS e JS;
- organização de dados e reutilização de código.

Ele pode ser usado como base para exercícios, provas, projetos acadêmicos e extensões futuras.
