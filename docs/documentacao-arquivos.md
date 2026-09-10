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

## 5. Arquivos estáticos do site legado

Esses arquivos fazem parte da versão anterior do front-end estático, mas continuam como referência de estrutura e conteúdo.

### [site/index.html](../site/index.html)
Função: página inicial do site legado.

### [site/catalogo.html](../site/catalogo.html)
Função: página que exibe o catálogo.

### [site/colecao.html](../site/colecao.html)
Função: página de coleções e arcos.

### [site/livro.html](../site/livro.html)
Função: página de detalhes do livro.

### [site/leitor.html](../site/leitor.html)
Função: ambiente de leitura do conteúdo.

### [site/loja.html](../site/loja.html)
Função: página de compras e itens disponíveis.

### [site/autor.html](../site/autor.html)
Função: perfil do autor.

### [site/assets/css/style.css](../site/assets/css/style.css)
Função: estilos do site legado.

### [site/assets/js/data.js](../site/assets/js/data.js)
Função: dados iniciais do front-end estático.

### [site/assets/js/app.js](../site/assets/js/app.js)
Função: lógica JS do site estático para renderização e navegação.

## 6. Observações de manutenção

- O projeto foi estruturado para separar domínio e apresentação.
- Alterações no catálogo da interface podem ocorrer sem mexer na lógica Java.
- Os arquivos legados em `site/` servem como referência e não são a fonte principal da interface atual.
- A principal base de construção atual é Vite + `src/main.js` + `src/style.css`.

## 7. Conclusão

Cada arquivo do projeto tem uma função específica dentro da arquitetura: definição de regras, dados, apresentação visual, navegação, documentação e execução. Essa separação deixa o sistema mais fácil de entender e expandir em projetos acadêmicos ou comerciais.

4. Veja se o CSS não está sobrescrevendo elementos.
5. Verifique o Java se a lógica de negócio estiver envolvida.

## 6. Dicas de estudo

- Comece pelo Java, porque ele explica a lógica de domínio.
- Depois estude a parte web, porque ela transforma dados em interface.
- Por fim, compare as relações entre dados e visual.

## 7. Conclusão

Cada arquivo tem um papel específico dentro do projeto. Entender essa divisão deixa o código mais fácil de manter, ajustar e reutilizar.
