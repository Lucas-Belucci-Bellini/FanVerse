/**
 * Representa um livro impresso ou físico.
 *
 * <p>Essa classe estende {@link Livro} e agrega uma informação específica da edição
 * física: a quantidade de páginas. Isso ajuda a exemplificar como subclasses podem
 * adicionar detalhes sem repetir regras gerais da classe base.</p>
 */
package livros;

public class LivroFisico extends Livro {
    // Quantidade total de páginas do exemplar físico.
    private int quantidadePaginas;

    /**
     * Cria um livro físico com validação da quantidade de páginas.
     *
     * @param titulo nome da obra
     * @param autor responsável pela obra
     * @param ano ano de publicação
     * @param quantidadePaginas total de páginas
     */
    public LivroFisico(String titulo, String autor, int ano, int quantidadePaginas) {
        super(titulo, autor, ano);
        setQuantidadePaginas(quantidadePaginas);
    }

    /**
     * Retorna o número de páginas.
     *
     * @return quantidade de páginas
     */
    public int getQuantidadePaginas() {
        return quantidadePaginas;
    }

    /**
     * Define a quantidade de páginas e valida se o valor é aceitável.
     *
     * @param quantidadePaginas número de páginas do livro
     */
    public void setQuantidadePaginas(int quantidadePaginas) {
        if (quantidadePaginas <= 0) {
            throw new IllegalArgumentException("A quantidade de páginas deve ser maior que zero.");
        }
        this.quantidadePaginas = quantidadePaginas;
    }

    /**
     * Exibe os dados do livro físico junto com as informações gerais da base.
     */
    @Override
    public void apresentarDados() {
        exibirDadosBasicos();
        System.out.println("Tipo: Livro Físico");
        System.out.println("Quantidade de páginas: " + quantidadePaginas);
    }

    /**
     * Simula a ação de abrir e folhear o livro físico.
     */
    public void folhear() {
        System.out.println("O livro físico '" + getTitulo() + "' está sendo folheado.");
    }

    /**
     * Representação textual do livro físico.
     *
     * @return string com os dados do objeto
     */
    @Override
    public String toString() {
        return "LivroFisico {" +
                "quantidadePaginas=" + quantidadePaginas +
                ", " + super.toString() +
                '}';
    }
}
