/**
 * Representa um livro com distribuição digital.
 *
 * <p>Herda de {@link Livro} e acrescenta dados específicos de conteúdo digital,
 * como tamanho do arquivo e ação de download. Esse tipo de classe mostra como a
 * herança facilita a reutilização de campos e métodos já definidos na classe base.</p>
 */
package livros;

public class LivroDigital extends Livro {
    // Guarda o tamanho do arquivo em MB, que é uma característica específica de e-books.
    private double tamanhoArquivo;

    /**
     * Cria um livro digital com todas as regras da classe base.
     *
     * @param titulo nome da obra
     * @param autor autor da obra
     * @param ano ano de publicação
     * @param tamanhoArquivo tamanho em MB
     */
    public LivroDigital(String titulo, String autor, int ano, double tamanhoArquivo) {
        super(titulo, autor, ano);
        setTamanhoArquivo(tamanhoArquivo);
    }

    /**
     * Retorna o tamanho do arquivo em megabytes.
     *
     * @return tamanho do arquivo
     */
    public double getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    /**
     * Define o tamanho do arquivo e impede valores inválidos.
     *
     * @param tamanhoArquivo tamanho em MB
     */
    public void setTamanhoArquivo(double tamanhoArquivo) {
        if (tamanhoArquivo <= 0) {
            throw new IllegalArgumentException("O tamanho do arquivo deve ser maior que zero.");
        }
        this.tamanhoArquivo = tamanhoArquivo;
    }

    /**
     * Exibe os dados do livro digital, incluindo as informações da classe base.
     */
    @Override
    public void apresentarDados() {
        exibirDadosBasicos();
        System.out.println("Tipo: Livro Digital");
        System.out.println("Tamanho do arquivo: " + tamanhoArquivo + " MB");
    }

    /**
     * Simula o download do ebook.
     */
    public void baixar() {
        System.out.println("O livro digital '" + getTitulo() + "' está sendo baixado.");
    }

    /**
     * Representação textual do livro digital.
     *
     * @return string completa da classe
     */
    @Override
    public String toString() {
        return "LivroDigital {" +
                "tamanhoArquivo=" + tamanhoArquivo +
                " MB, " + super.toString() +
                '}';
    }
}
