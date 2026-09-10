/**
 * Gerencia o catálogo principal com limite inicial de 50 livros.
 * A classe centraliza a validação e a organização do acervo do sistema.
 */
package catalogo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import livros.Livro;

public class Catalogo {
    private static final int LIMITE_LIVROS = 50;
    private final List<Livro> livros;

    public Catalogo() {
        this.livros = new ArrayList<>();
    }

    public static int getLimiteLivros() {
        return LIMITE_LIVROS;
    }

    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro não pode ser nulo.");
        }

        if (livros.size() >= LIMITE_LIVROS) {
            throw new IllegalStateException("O catálogo atingiu o limite máximo de 50 livros.");
        }

        livros.add(livro);
    }

    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

    public Livro buscarPorTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("Título inválido para busca.");
        }

        for (Livro livro : livros) {
            if (livro.getTitulo().equalsIgnoreCase(titulo.trim())) {
                return livro;
            }
        }

        return null;
    }

    public Livro buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new IllegalArgumentException("Código inválido para busca.");
        }

        for (Livro livro : livros) {
            if (livro.getCodigoLivro().getCodigo().equalsIgnoreCase(codigo.trim())) {
                return livro;
            }
        }

        return null;
    }

    public List<Livro> listarLivros() {
        return Collections.unmodifiableList(livros);
    }

    public int quantidadeLivros() {
        return livros.size();
    }

    public boolean limiteAtingido() {
        return livros.size() >= LIMITE_LIVROS;
    }

    public List<Livro> listarLivrosPorColecao(String nomeColecao) {
        List<Livro> livrosDaColecao = new ArrayList<>();
        for (Livro livro : livros) {
            if (livro.getTitulo().toLowerCase().contains(nomeColecao.toLowerCase())) {
                livrosDaColecao.add(livro);
            }
        }
        return livrosDaColecao;
    }

    @Override
    public String toString() {
        return "Catalogo {quantidade=" + livros.size() + ", limite=" + LIMITE_LIVROS + ", livros=" + livros + '}';
    }
}
