# FanVerse — Modelo de Dados Atual

## Catálogo web

O catálogo JSON possui a estrutura conceitual:

```text
Catalogo
├── author
└── collections[]
    └── arcs[]
        └── books[]
```

## Autor

Representa os dados associados ao autor do catálogo.

## Coleção

Agrupa obras relacionadas.

Campos observados no catálogo incluem informações de identificação, descrição e agrupamento narrativo.

## Arco

Representa uma subdivisão narrativa dentro de uma coleção.

## Livro

O catálogo web representa livros com informações como:
- identificação;
- título;
- descrição;
- tipo;
- preço;
- status;
- ano;
- quantidade de capítulos;
- capa;
- conteúdo.

A estrutura exata do JSON deve ser tratada como contrato até que uma mudança de schema seja planejada.

## Modelo Java

### Livro

A classe base representa informações gerais de uma obra.

### LivroDigital

Especialização de `Livro` para obras digitais, incluindo tamanho de arquivo.

### LivroFisico

Especialização de `Livro` para obras físicas, incluindo quantidade de páginas.

### CodigoLivro

Representa o identificador associado ao livro.

### Usuario

Possui:
- nome;
- matrícula.

Também participa do fluxo de empréstimo.

### Biblioteca

Possui:
- nome;
- cidade;
- usuário associado.

Também registra empréstimos e compras.

### Catalogo

Mantém uma coleção de livros e possui uma regra de limite de 50 itens no domínio Java.

### Colecao

Agrupa livros e representa uma coleção narrativa.

### Compra

A implementação principal está em `compras.Compra`.

Possui:
- ID da compra;
- comprador;
- livro;
- valor;
- data;
- status;
- método de pagamento.

Existe também `biblioteca.Compra`, mantida como classe de compatibilidade/depreciação.

## Divergência importante

O modelo Java e o modelo JSON são conceitos relacionados, mas não são o mesmo schema.

Qualquer tentativa futura de sincronização deve definir explicitamente:
- IDs;
- campos obrigatórios;
- origem da verdade;
- regras de conversão;
- tratamento de tipos digitais/físicos;
- estratégia de versionamento do schema.
