# Documentação detalhada dos arquivos

Este documento explica, de forma organizada, o papel de cada arquivo do projeto.

## 1. Arquivos principais do Java

### [src/livros/Livro.java](../src/livros/Livro.java)

Função:
- classe base para todos os tipos de livro;
- centraliza título, autor, ano e código identificador;
- define métodos de visualização e validação.

Pontos importantes:
- encapsulamento com atributos privados;
- validação em setters;
- método `apresentarDados()` para polimorfismo;
- método `exibirMensagem()` com sobrecarga;
- `toString()` para representação textual.

Quando reutilizar:
- qualquer sistema que tenha entidades com identificador e dados básicos.

### [src/livros/LivroDigital.java](../src/livros/LivroDigital.java)

Função:
- especialização da classe `Livro` para conteúdo digital.

Métodos relevantes:
- `apresentarDados()`;
- `baixar()`;
- `setTamanhoArquivo()`.

Quando reutilizar:
- em sistemas de e-books, arquivos digitais ou downloads.

### [src/livros/LivroFisico.java](../src/livros/LivroFisico.java)

Função:
- especialização para livros impressos.

Métodos relevantes:
- `apresentarDados()`;
- `folhear()`;
- `setQuantidadePaginas()`.

Quando reutilizar:
- em bibliotecas físicas, estoque ou catalogação de produtos impressos.

### [src/usuarios/Usuario.java](../src/usuarios/Usuario.java)

Função:
- modela um usuário responsável por empréstimos.

Métodos relevantes:
- `realizarEmprestimo(Livro livro)`;
- `setNome()`;
- `setMatricula()`.

Quando reutilizar:
- em qualquer sistema com contas de usuário, aluno, cliente ou membro.

### [src/biblioteca/Biblioteca.java](../src/biblioteca/Biblioteca.java)

Função:
- representa a biblioteca e seus relacionamentos.

Métodos relevantes:
- `associarUsuario(Usuario usuario)`;
- `registrarEmprestimo(Livro livro)`;
- `registrarCompra(...)`.

Quando reutilizar:
- em sistemas de gestão de acervo, empréstimo e transações.

### [src/catalogo/Catalogo.java](../src/catalogo/Catalogo.java)

Função:
- guarda uma coleção de livros com limite máximo de 50.

Métodos relevantes:
- `adicionarLivro()`;
- `removerLivro()`;
- `buscarPorTitulo()`;
- `buscarPorCodigo()`;
- `listarLivros()`;
- `quantidadeLivros()`.

Quando reutilizar:
- qualquer catálogo com limite de itens ou busca por identificador.

### [src/colecoes/Colecao.java](../src/colecoes/Colecao.java)

Função:
- representa uma coleção ou série de livros.

Métodos relevantes:
- `adicionarLivro()`;
- `removerLivro()`;
- `procurarLivroPorTitulo()`;
- `obterLivroPorPosicao()`;
- `apresentarInformacoes()`.

Quando reutilizar:
- em projetos com séries, gêneros, coleções e agrupamentos temáticos.

### [src/colecoes/ColecaoLivros.java](../src/colecoes/ColecaoLivros.java)

Função:
- versão mais simples de coleção com limite máximo de 50 itens.

Quando reutilizar:
- quando você precisa de um controle simples de um conjunto de itens.

### [src/biblioteca/Compra.java](../src/biblioteca/Compra.java)

Função:
- modela uma compra.

Atributos principais:
- usuário;
- livro;
- valor;
- método de pagamento;
- status de conclusão.

Métodos relevantes:
- `processarCompra()`;
- `setValor()`;
- `setMetodoPagamento()`.

Quando reutilizar:
- em qualquer sistema de vendas, pedidos ou transações.

### [src/principal/Principal.java](../src/principal/Principal.java)

Função:
- ponto de entrada do sistema.

O que ele faz:
- cria instâncias de livros e usuários;
- demonstra herança e polimorfismo;
- simula empréstimos;
- exemplifica catálogo e coleções;
- mostra uso de compra.

## 2. Arquivos do site

### [site/index.html](../site/index.html)

Função:
- página inicial do FanVerse;
- apresenta a obra em destaque e coleções recentes.

Elementos principais:
- hero section;
- grid de destaques;
- seção de coleções;
- estrutura de navegação.

### [site/catalogo.html](../site/catalogo.html)

Função:
- exibe catálogo completo;
- permite pesquisar e filtrar conteúdos.

Elementos principais:
- campo de busca;
- filtro por tipo;
- filtro por status;
- grid de cards com livros.

### [site/colecao.html](../site/colecao.html)

Função:
- mostra detalhes de uma coleção e seus arcos.

Elementos principais:
- capa da coleção;
- descrição;
- lista de arcos;
- links para livros.

### [site/livro.html](../site/livro.html)

Função:
- detalha um livro isolado.

Elementos principais:
- capa;
- título;
- descrição;
- preço;
- status de disponibilidade;
- botões de leitura e compra.

### [site/leitor.html](../site/leitor.html)

Função:
- exibe o conteúdo do livro em ambiente de leitura.

Elementos principais:
- área de leitura;
- cabeçalho do livro;
- texto em bloco;
- botões de navegação entre capítulos.

### [site/loja.html](../site/loja.html)

Função:
- mostra todos os itens disponíveis para compra.

### [site/autor.html](../site/autor.html)

Função:
- apresenta o autor e sua identidade literária.

## 3. Arquivos de dados e scripts

### [data/catalogo.json](../data/catalogo.json)

Função:
- banco de dados do catálogo do front-end.

Estrutura:
- author;
- collections;
- arcs;
- books.

Esse arquivo separa os dados do site da lógica em Java e permite uma reutilização mais fácil.

### [site/assets/js/data.js](../site/assets/js/data.js)

Função:
- define os dados iniciais do site;
- cria arrays e estruturas com livros e coleções;
- prepara funções auxiliares como `getBookById` e `getCollectionById`.

### [site/assets/js/app.js](../site/assets/js/app.js)

Função:
- responsável pela renderização dinâmica das páginas;
- lê dados e preenche HTML;
- aplica filtros e busca;
- controla tema claro/escuro.

Funções principais:
- `renderHome()`;
- `renderCatalogo()`;
- `renderCollection()`;
- `renderLivro()`;
- `renderLoja()`;
- `renderAutor()`;
- `renderLeitor()`;
- `initThemeToggle()`.

### [site/assets/css/style.css](../site/assets/css/style.css)

Função:
- define o visual do projeto;
- aplica layout, cores, espaçamento, cards, botões e responsividade.

Blocos importantes:
- estilos globais;
- header e navegação;
- hero section;
- grid de cards;
- página de coleção;
- página de livro;
- leitor;
- loja;
- responsividade mobile.

## 4. Arquivos de configuração

### [package.json](../package.json)

Função:
- define scripts do projeto;
- configura dependências e comandos de execução.

### [server.js](../server.js)

Função:
- inicia um servidor Express para servir o front-end e expor API REST.

Rotas relevantes:
- `GET /api/catalogo`;
- `GET /api/catalogo/books`;
- `GET /api/catalogo/book/:id`;
- `GET /api/catalogo/collection/:id`.

## 5. Checklist para debug

Quando houver erro, siga esta ordem:

1. Verifique o arquivo HTML relacionado à página.
2. Confira o script JavaScript que renderiza a página.
3. Valide se os dados foram carregados corretamente.
4. Veja se o CSS não está sobrescrevendo elementos.
5. Verifique o Java se a lógica de negócio estiver envolvida.

## 6. Dicas de estudo

- Comece pelo Java, porque ele explica a lógica de domínio.
- Depois estude a parte web, porque ela transforma dados em interface.
- Por fim, compare as relações entre dados e visual.

## 7. Conclusão

Cada arquivo tem um papel específico dentro do projeto. Entender essa divisão deixa o código mais fácil de manter, ajustar e reutilizar.
