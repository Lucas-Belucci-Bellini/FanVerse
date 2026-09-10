# FanVerse

Sistema Java de biblioteca e catálogo para organização de fan fictions, arcos, coleções e livros digitais.

## Objetivo
O projeto foi pensado para funcionar como base para um catálogo de obras, com foco em:

- organização de livros e coleções;
- estrutura para até 50 obras catalogadas;
- suporte a livros digitais e físicos;
- controle básico de empréstimos;
- preparação para futuras compras e distribuição de conteúdos em Markdown.

## Estrutura principal

```text
FanVerse/
├── README.md
├── src/
│   ├── biblioteca/
│   │   └── Biblioteca.java
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
├── livros md/
│   ├── README.md
│   ├── cronicas-baluarte-arco-01.md
│   ├── cronicas-baluarte-arco-02.md
│   └── fanfic-sol-volume-01.md
└── out/
```

## Como compilar
No terminal, na pasta do projeto:

```bash
javac -d out $(find src -name "*.java")
```

No Windows PowerShell:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
```

## Como executar

```bash
java -cp out principal.Principal
```

## Conceitos implementados
- encapsulamento com atributos privados;
- herança com `extends` e `super()`;
- polimorfismo com listas `Livro` e chamadas de `apresentarDados()`;
- sobrecarga com `exibirMensagem()` e `exibirMensagem(String)`;
- composição com `CodigoLivro` dentro de `Livro`;
- agregação com `Biblioteca` e `Usuario`;
- associação simples com `realizarEmprestimo(Livro livro)`;
- catálogo com limite de `50` livros;
- coleções como entidade independente para obras e arcos;
- arquitetura preparada para futuras compras e arquivos Markdown.

## Como adicionar novos livros
Crie uma instância do tipo desejado, por exemplo:

```java
LivroDigital digital = new LivroDigital("Título", "Lucas Belucci Bellini", 2026, 120.0);
LivroFisico fisico = new LivroFisico("Título", "Lucas Belucci Bellini", 2026, 250);
```

Depois adicione ao catálogo ou à coleção:

```java
Catalogo catalogo = new Catalogo();
catalogo.adicionarLivro(digital);
```

## Como criar uma coleção

```java
Colecao colecao = new Colecao("Nome da Coleção", "Descrição da obra", "Lucas Belucci Bellini");
colecao.adicionarLivro(digital);
colecao.adicionarLivro(fisico);
```

## Arquivos Markdown
A pasta `livros md/` é um espaço reservado para armazenar os conteúdos das obras em `.md`, como:

- `cronicas-baluarte-arco-01.md`
- `cronicas-baluarte-arco-02.md`
- `fanfic-sol-volume-01.md`

Essa estrutura permite, no futuro, associar cada livro ao seu arquivo Markdown correspondente.

## Limite de 50 livros
A constante de limite fica centralizada em `Catalogo`:

```java
private static final int LIMITE_LIVROS = 50;
```

Assim, o controle do limite fica em um único lugar e facilita futuras alterações de regra.

## Futuras expansões planejadas
- sistema de login e usuários;
- catálogo online;
- associação de arquivos `.md` a cada obra;
- histórico de empréstimos;
- vendas e compras;
- integração com site ou API.

## Autor padrão
Todos os livros do projeto consideram como autor padrão:

`Lucas Belucci Bellini`
