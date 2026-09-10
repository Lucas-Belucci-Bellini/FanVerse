    # Documentação detalhada dos arquivos

Este documento explica a finalidade de cada arquivo principal do projeto, com foco na estrutura atual em Java, Vite e catálogo dinâmico.

## 1. Arquivos de configuração e entrada do projeto

### [package.json](../package.json)

Função:
- define as dependências do projeto;
- guarda os scripts de desenvolvimento, build e execução;
- configura o ambiente do Vite e do Express.

Pontos-chave:
- `npm run dev`: inicia o ambiente de desenvolvimento do Vite;
- `npm run build`: gera a build de produção;
- `npm start`: inicia o servidor Express.

### [vite.config.js](../vite.config.js)

Função:
- configura a aplicação Vite;
- define host e porta do servidor de desenvolvimento;
- define a pasta de saída `dist`.

### [index.html](../index.html)

Função:
- arquivo HTML principal usado como ponto de entrada do Vite;
- carrega o app principal em JavaScript;
- funciona como base da interface moderna do sistema.

### [.gitignore](../.gitignore)

Função:
- evita que arquivos de instalação e build sejam enviados ao Git;
- mantém o repositório limpo e mais leve.

## 2. Arquivos da camada web moderna

### [src/main.js](../src/main.js)

Função:
- é o coração da interface atual do FanVerse;
- renderiza o catálogo, a hero section e o editor de catálogo;
- lê os dados do catálogo;
- salva alterações no navegador em `localStorage`;
- manteve a lógica Java sem ser alterada.

Responsabilidades principais:
- carregar o catálogo;
- montar a página com os cards dos livros;
- criar o formulário de edição;
- inserir novas coleções e livros;
- resetar o catálogo local.

### [src/style.css](../src/style.css)

Função:
- define todo o visual premium do sistema;
- aplica layout, cores, cards, hero section, métricas, botões e responsividade;
- controla a identidade visual do front-end.

### [server.js](../server.js)

Função:
- serve o site e expõe API REST para o catálogo;
- lê e grava o JSON do catálogo em `data/catalogo.json`;
- permite integração com um front-end ou sistema futuro sem mexer no Java.

Endpoints principais:
- `GET /api/catalogo`
- `PUT /api/catalogo`
- `GET /api/catalogo/books`
- `GET /api/catalogo/book/:id`
- `GET /api/catalogo/collection/:id`

## 3. Arquivos de dados

### [data/catalogo.json](../data/catalogo.json)

Função:
- armazena as coleções, arcos e livros do catálogo;
- funciona como base de dados leve para a interface web;
- separa o conteúdo do site da lógica Java.

Estrutura principal:
- `author`
- `collections`
- `arcs`
- `books`

## 4. Arquivos do Java: modelo de negócio

### [src/livros/Livro.java](../src/livros/Livro.java)

Função:
- classe base de todos os livros do sistema;
- guarda dados gerais como título, autor, ano e código;
- define comportamento comum como apresentação e mensagens.

Pontos importantes:
- encapsulamento;
- validação de dados;
- métodos `apresentarDados()` e `exibirMensagem()`;
- polimorfismo e sobrecarga.

### [src/livros/LivroDigital.java](../src/livros/LivroDigital.java)

Função:
- representa um livro digital;
- especializa a classe `Livro` com atributos específicos como arquivo e tamanho.

### [src/livros/LivroFisico.java](../src/livros/LivroFisico.java)

Função:
- representa um livro físico;
- adiciona informações como quantidade de páginas;
- exemplifica herança e manutenção de dados específicos por tipo de livro.

### [src/livros/CodigoLivro.java](../src/livros/CodigoLivro.java)

Função:
- representa o identificador do livro;
- demonstra composição dentro da classe `Livro`.

### [src/usuarios/Usuario.java](../src/usuarios/Usuario.java)

Função:
- modela um usuário do sistema;
- representa aluno, cliente ou membro da biblioteca;
- permite operações relacionadas a empréstimos.

### [src/biblioteca/Biblioteca.java](../src/biblioteca/Biblioteca.java)

Função:
- centraliza a associação entre usuários e acervo;
- registra empréstimos e movimentações da biblioteca.

### [src/biblioteca/Compra.java](../src/biblioteca/Compra.java)

Função:
- modela uma transação de compra;
- guarda usuário, livro, valor, forma de pagamento e status.

### [src/catalogo/Catalogo.java](../src/catalogo/Catalogo.java)

Função:
- representa o catálogo do sistema;
- controla a quantidade máxima de itens;
- facilita adicionar, buscar e listar livros.

Ponto importante:
- o catálogo tem limite de 50 livros, conforme requisito do projeto.

### [src/colecoes/Colecao.java](../src/colecoes/Colecao.java)

Função:
- representa uma coleção ou série de livros;
- organiza obras por tema, universo ou narrativa.

### [src/colecoes/ColecaoLivros.java](../src/colecoes/ColecaoLivros.java)

Função:
- oferece uma estrutura auxiliar para coleções de livros;
- complementa a lógica de agrupamento e visualização das obras.

### [src/principal/Principal.java](../src/principal/Principal.java)

Função:
- ponto de entrada da aplicação Java;
- cria objetos, demonstra polimorfismo e simula o uso completo do sistema;
- serve como exemplo de execução e validação do domínio.

## 5. HTML e CSS por página

A estrutura visual do FanVerse é composta por páginas HTML semânticas e por um stylesheet compartilhado. Esse padrão facilita manutenção porque o conteúdo, a estrutura e o estilo ficam organizados em arquivos específicos.

### [index.html](../index.html)
Função:
- arquivo principal do front-end Vite;
- serve como ponto de entrada para rodar a aplicação moderna;
- carrega o ambiente JavaScript e define o início da navegação.

O que ele contém:
- a tag `<head>` com meta tags, viewport e título da página;
- a estrutura do `body` para a página inicial principal;
- ligação com o bundle do Vite e o projeto web atual.

Relação com o CSS:
- o estilo geral é controlado por `src/style.css`;
- os elementos visualmente principais são `header`, `main`, `section`, `hero`, `card` e `footer`.

### [site/index.html](../site/index.html)
Função:
- página inicial do site estático legado;
- apresenta a identidade visual da FanVerse antes do sistema Vite;
- organiza a navegação e destaque de livros/coleções.

Estrutura principal:
- `header.topbar`: barra superior com marca e navegação;
- `section.hero`: introdução visual com chamada principal;
- `section`: blocos de "Obras em destaque" e "Coleções mais recentes";
- `footer`: rodapé com links úteis.

Elementos importantes:
- `#hero-book`: título da obra principal exibido dinamicamente;
- `#featured-books`: área onde os livros em destaque são renderizados;
- `#collection-cards`: cards de coleções da página inicial.

CSS relacionado:
- `.hero`, `.hero-grid`, `.hero-card`, `.card`, `.grid-3`, `.feature-strip`, `.topbar`.

### [site/catalogo.html](../site/catalogo.html)
Função:
- exibe o catálogo completo da FanVerse;
- oferece filtros por tipo de obra e disponibilidade;
- permite busca textual em títulos, arcos e coleções.

Estrutura principal:
- `header`: mantém a navegação uniforme em todas as páginas;
- `main.container.section`: área central de catálogo;
- `.catalog-tools`: barra com pesquisa e filtros;
- `#catalog-list`: espaço de renderização dos cards de livros.

Elementos chave:
- `#catalog-search`: campo de busca;
- `#tipo-filtro`: filtro por tipo digital/físico;
- `#status-filtro`: filtro por disponibilidade do livro.

CSS relacionado:
- `.catalog-tools`, `.search-box`, `.filter-box`, `.grid-3`, `.card`, `.status`.

### [site/colecao.html](../site/colecao.html)
Função:
- mostra uma coleção específica com capa, descrição e arcos;
- organiza a narrativa em blocos de conteúdo por arc/parte.

Estrutura principal:
- `section.collection-hero`: capa + descrição + estatísticas;
- `#collection-cover`: imagem da coleção;
- `#arc-list`: lista de arcos e volumes relacionados.

Elementos importantes:
- `#collection-title`, `#collection-description`, `#collection-meta`;
- `#arc-list` renderiza itens da coleção.

CSS relacionado:
- `.collection-hero`, `.collection-cover`, `.stats`, `.stat-box`, `.list-panel`, `.arc-item`.

### [site/livro.html](../site/livro.html)
Função:
- apresenta os detalhes do livro selecionado;
- mostra a capa, descrição, preço, disponibilidade e ações de compra/leitura.

Estrutura principal:
- `section.book-layout`: separa capa e informações do livro;
- `#book-cover`: capa do título;
- `#book-meta`: autor, tipo e detalhes do registro;
- `#book-price`: preço exibido em destaque;
- `#read-link` e `#buy-link`: ações de navegação e compra.

CSS relacionado:
- `.book-layout`, `.book-cover-box`, `.book-info`, `.price-box`, `.buy-actions`, `.status`.

### [site/leitor.html](../site/leitor.html)
Função:
- simula uma experiência de leitura digital;
- contém painel de leitura com texto, títulos, controles de navegação e opções de visualização.

Estrutura principal:
- `.reader-shell`: contêiner central da tela de leitura;
- `.reader-view`: caixa principal com estilo de página;
- `.reader-toolbar`: barra superior de controles;
- `.reader-body`: bloco de conteúdo e leitura;
- `.chapter-nav`: navegação entre capítulos.

Elementos importantes:
- `#reader-title`, `#reader-subtitle`, `#reader-text`;
- `#chapter-prev`, `#chapter-next`.

CSS relacionado:
- `.reader-shell`, `.reader-view`, `.reader-toolbar`, `.reader-controls`, `.icon-btn`, `.reader-body`, `.reader-text`, `.chapter-nav`.

### [site/loja.html](../site/loja.html)
Função:
- mostra produtos e livros disponíveis para compra;
- centraliza itens do catálogo em um layout de loja.

Estrutura principal:
- cabeçalho padrão;
- `main.container.section`;
- `#shop-grid` para renderizar os produtos da loja.

CSS relacionado:
- `.shop-grid`, `.card`, `.price`, `.small-button`.

### [site/autor.html](../site/autor.html)
Função:
- exibe a biografia do autor e sua identidade no universo literário.

Estrutura principal:
- `.author-shell`: layout com foto e texto do autor;
- `#author-photo`: imagem do autor;
- `#author-name`, `#author-bio`: informações principais;
- `.stat-box`: blocos de dados como localização e especialidade.

CSS relacionado:
- `.author-shell`, `.author-photo`, `.collection-details`, `.stat-box`.

### [site/assets/css/style.css](../site/assets/css/style.css)
Função:
- folha de estilos compartilhada por todas as páginas estáticas do site;
- define identidade visual, layout e responsividade do projeto.

Blocos principais:
- `:root`: variáveis de tema, cores, bordas, sombras e raios de borda;
- `body`: base visual da página, incluindo fundo escuro e tipografia;
- `.topbar`: barra de navegação fixada com efeito glass;
- `.button` e `.button-secondary`: estilos de botões principais;
- `.hero`: apresentação inicial com grande contraste visual;
- `.card`: cards de livros/coleções;
- `.collection-hero`, `.book-layout`, `.reader-shell`, `.author-shell`: layouts específicos;
- `.catalog-tools`: área de pesquisa/filtro;
- `@media (max-width: 920px)`: responsividade para telas menores.

Observações:
- esse arquivo é o núcleo da aparência do IP do projeto por páginas;
- alterações aqui afetam todas as telas compartilhando o mesmo estilo;
- por isso, mudanças visuais devem ser feitas com cuidado para não sobrescrever elementos entre telas.

### [site/assets/js/data.js](../site/assets/js/data.js)
Função:
- armazena os dados estruturados usados pelo front-end estático;
- alimenta as páginas com informações de livros, coleções, autor e arcos.

Relacionamento com HTML:
- as páginas usam `id` específicos para receber conteúdo dinâmico;
- o JavaScript consulta esse arquivo para montar os cards e os detalhes das obras.

### [site/assets/js/app.js](../site/assets/js/app.js)
Função:
- controla a lógica da navegação e renderização da interface;
- lê dados do `data.js` e povoar os elementos HTML de cada página;
- permite alternar temas, montar cards, filtrar catálogo e abrir páginas relacionadas.

## 6. Observações de manutenção

- O projeto foi estruturado para separar domínio e apresentação.
- O Java continua sendo a lógica de negócio, enquanto o HTML/CSS/JS controlam a experiência visual e interativa.
- Os arquivos em `site/` são úteis como referência do front-end estático, mas a base atual de desenvolvimento é o frontend Vite em `src/`.
- O CSS é compartilhado e precisa ser revisado com atenção para evitar sobrescrita de classes em páginas diferentes.
- A documentação por arquivo reduz o risco de regressões e facilita a manutenção acadêmica e profissional.

## 7. Dicas de estudo

- Comece pelo Java para entender a lógica de negócio e o modelo de domínio.
- Depois estude o HTML para entender a estrutura das páginas.
- Em seguida, revise o CSS para perceber como a aparência é aplicada.
- Por fim, compare o comportamento do JavaScript com a estrutura HTML para entender a lógica de renderização e interatividade.

## 8. Conclusão

Cada arquivo do projeto tem um papel específico: regras de negócio, dados, apresentação visual, navegação, leitura e compra. Entender essa divisão torna o sistema mais fácil de manter, ajustar e reutilizar, especialmente em um contexto acadêmico ou de evolução futura do projeto.
