/**
 * Versão simplificada de uma coleção de livros.
 *
 * <p>Essa classe é útil quando a ideia é guardar vários itens em uma lista e manter um
 * limite máximo de 50 registros. É mais leve que {@link Colecao}, mas mantém o mesmo
 * princípio: organizar bibliotecas ou seleções de obras por agrupamento.</p>
 */
package colecoes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import livros.Livro;

public class ColecaoLivros {
    // Limite máximo de registros permitidos nesta coleção simples.
    private static final int LIMITE_MAXIMO = 50;
    // Lista interna de livros da coleção.
    private final List<Livro> livros;

    /**
     * Cria uma coleção vazia.
     */
    public ColecaoLivros() {
        this.livros = new ArrayList<>();
    }

    /**
     * Adiciona um livro se ainda houver espaço na lista.
     *
     * @param livro livro a ser adicionado
     */
    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro não pode ser nulo.");
        }

        if (livros.size() >= LIMITE_MAXIMO) {
            throw new IllegalStateException("A coleção já atingiu o limite máximo de 50 livros.");
        }

        livros.add(livro);
    }

    /**
     * Remove um livro da coleção.
     *
     * @param livro livro a ser removido
     * @return true se a operação obteve sucesso
     */
    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

    /**
     * Retorna a lista de livros em modo sem modificação externa.
     *
     * @return lista imutável de livros
     */
    public List<Livro> listarLivros() {
        return Collections.unmodifiableList(livros);
    }

    /**
     * Retorna a quantidade atual de itens armazenados.
     *
     * @return total de livros
     */
    public int getQuantidadeLivros() {
        return livros.size();
    }

    /**
     * Representação textual da coleção para debug.
     *
     * @return resumo da lista
     */
    @Override
    public String toString() {
        return "ColecaoLivros {quantidade=" + livros.size() + ", livros=" + livros + '}';
    }
}
