/**
 * Versão com limite de capacidade da coleção principal.
 *
 * <p>Essa classe mantém a mesma ideia da coleção genérica, mas reforça uma regra de
 * capacidade máxima. Em vez de duplicar a lógica, ela reaproveita a estrutura e a
 * validação já presentes em {@link Colecao}, deixando o domínio mais consistente.</p>
 */
package colecoes;

import livros.Livro;

public class ColecaoLivros extends Colecao {
    // Limite máximo de registros permitidos nesta coleção específica.
    private static final int LIMITE_MAXIMO = 50;

    /**
     * Cria uma coleção limitada com dados básicos.
     *
     * @param nome nome da coleção
     * @param descricao descrição da coleção
     * @param autor autor da obra
     */
    public ColecaoLivros(String nome, String descricao, String autor) {
        super(nome, descricao, autor);
    }

    /**
     * Retorna o limite máximo de livros da coleção.
     *
     * @return capacidade máxima permitida
     */
    public static int getLimiteMaximo() {
        return LIMITE_MAXIMO;
    }

    /**
     * Adiciona um livro respeitando o limite máximo da coleção.
     *
     * @param livro livro a ser incluído
     */
    @Override
    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro não pode ser nulo.");
        }

        if (quantidadeLivros() >= LIMITE_MAXIMO) {
            throw new IllegalStateException("A coleção já atingiu o limite máximo de 50 livros.");
        }

        super.adicionarLivro(livro);
    }

    /**
     * Retorna a quantidade atual de livros armazenados.
     *
     * @return total de livros
     */
    public int getQuantidadeLivros() {
        return quantidadeLivros();
    }

    /**
     * Representação textual da coleção para debug.
     *
     * @return resumo da coleção com o limite
     */
    @Override
    public String toString() {
        return "ColecaoLivros {nome='" + getNome() + "', quantidade=" + quantidadeLivros() + ", limite=" + LIMITE_MAXIMO + '}';
    }
}
