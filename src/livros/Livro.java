/**
 * Classe base do sistema FanVerse.
 *
 * <p>Essa é a classe principal da hierarquia de livros. Ela representa o modelo
 * genérico de qualquer obra da biblioteca e funciona como ponto de base para livros
 * digitais e físicos. Todas as características comuns dos livros ficam aqui, como
 * título, autor, ano e código interno.</p>
 *
 * <p>Este arquivo é um dos mais importantes da aplicação, porque demonstra os
 * conceitos de encapsulamento, composição e polimorfismo. Qualquer nova categoria
 * de publicação pode herdar desta classe sem precisar reescrever as regras básicas.</p>
 */
package livros;

public class Livro {
    // Atributos da classe. Todos são privados para preservar o encapsulamento.
    private String titulo;
    private String autor;
    private int ano;
    private CodigoLivro codigoLivro;

    /**
     * Construtor da classe Livro.
     *
     * @param titulo nome da obra
     * @param autor responsável pela criação da obra
     * @param ano ano de publicação ou lançamento
     */
    public Livro(String titulo, String autor, int ano) {
        setTitulo(titulo);
        setAutor(autor);
        setAno(ano);
        this.codigoLivro = new CodigoLivro();
    }

    /**
     * Retorna o título do livro.
     *
     * @return título da obra
     */
    public String getTitulo() {
        return titulo;
    }

    /**
     * Define o título do livro com validação.
     *
     * @param titulo novo título
     */
    public void setTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("O título do livro não pode ficar vazio.");
        }
        this.titulo = titulo.trim();
    }

    /**
     * Retorna o nome do autor.
     *
     * @return autor da obra
     */
    public String getAutor() {
        return autor;
    }

    /**
     * Define o autor do livro após validar a informação.
     *
     * @param autor nome do autor
     */
    public void setAutor(String autor) {
        if (autor == null || autor.trim().isEmpty()) {
            throw new IllegalArgumentException("O autor não pode ficar vazio.");
        }
        this.autor = autor.trim();
    }

    /**
     * Retorna o ano de publicação.
     *
     * @return ano da obra
     */
    public int getAno() {
        return ano;
    }

    /**
     * Define o ano da obra, garantindo que ele seja válido.
     *
     * @param ano ano de publicação
     */
    public void setAno(int ano) {
        if (ano <= 0) {
            throw new IllegalArgumentException("O ano deve ser maior que zero.");
        }
        this.ano = ano;
    }

    /**
     * Retorna o objeto que guarda o código único do livro.
     *
     * @return código interno do livro
     */
    public CodigoLivro getCodigoLivro() {
        return codigoLivro;
    }

    /**
     * Exibe os dados básicos do livro sem repetir lógica nas subclasses.
     *
     * <p>Este método é protegido para ser usado pelas classes filhas, que
     * complementam o conteúdo com informações específicas.</p>
     */
    protected void exibirDadosBasicos() {
        System.out.println("Título: " + titulo);
        System.out.println("Autor: " + autor);
        System.out.println("Ano: " + ano);
        System.out.println("Código do livro: " + codigoLivro.getCodigo());
        System.out.println("Identificação: " + codigoLivro.getIdentificacao());
    }

    /**
     * Exibe os dados do livro.
     *
     * <p>Este método é usado no polimorfismo, pois as subclasses sobrescrevem a
     * implementação para incluir dados específicos do tipo do livro.</p>
     */
    public void apresentarDados() {
        exibirDadosBasicos();
    }

    /**
     * Exibe uma mensagem padrão de disponibilidade.
     */
    public void exibirMensagem() {
        System.out.println("Mensagem padrão: este livro está disponível na biblioteca.");
    }

    /**
     * Exibe uma mensagem personalizada enviada pelo chamador.
     *
     * @param mensagem texto que será impresso na tela
     */
    public void exibirMensagem(String mensagem) {
        System.out.println(mensagem);
    }

    /**
     * Representação textual do objeto para depuração e logs.
     *
     * @return string com os dados do livro
     */
    @Override
    public String toString() {
        return "Livro {" +
                "titulo='" + titulo + '\'' +
                ", autor='" + autor + '\'' +
                ", ano=" + ano +
                ", codigoLivro=" + codigoLivro +
                '}';
    }
}
