/**
 * Gerencia uma coleção de livros, permitindo cadastrar e listar itens até um limite de 50 registros.
 * Esta estrutura ajuda a organizar fan fictions, arcos e capítulos em uma biblioteca pessoal.
 */
package colecoes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import livros.Livro;

public class ColecaoLivros {
    private static final int LIMITE_MAXIMO = 50;
    private final List<Livro> livros;

    public ColecaoLivros() {
        this.livros = new ArrayList<>();
    }

    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro não pode ser nulo.");
        }

        if (livros.size() >= LIMITE_MAXIMO) {
            throw new IllegalStateException("A coleção já atingiu o limite máximo de 50 livros.");
        }

        livros.add(livro);
    }

    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

    public List<Livro> listarLivros() {
        return Collections.unmodifiableList(livros);
    }

    public int getQuantidadeLivros() {
        return livros.size();
    }

    @Override
    public String toString() {
        return "ColecaoLivros {quantidade=" + livros.size() + ", livros=" + livros + '}';
    }
}
