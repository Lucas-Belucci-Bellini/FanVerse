/**
 * Controla o catálogo principal do sistema.
 *
 * <p>Essa classe concentra a lógica de cadastro, busca e controle de limite de livros.
 * Ela funciona como um repositório simples in-memory, útil para demonstrar a gestão de
 * um acervo com até 50 itens e para mostrar como o projeto pode evoluir para uma API ou
 * banco de dados real.</p>
 */
package catalogo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import livros.Livro;

public class Catalogo {
    // Limite máximo de obras que o catálogo pode armazenar.
    private static final int LIMITE_LIVROS = 50;
    // Lista em memória dos livros cadastrados.
    private final List<Livro> livros;

    /**
     * Cria um catálogo vazio.
     */
    public Catalogo() {
        this.livros = new ArrayList<>();
    }

    /**
     * Retorna o limite máximo permitido.
     *
     * @return limite de livros
     */
    public static int getLimiteLivros() {
        return LIMITE_LIVROS;
    }

    /**
     * Adiciona um livro ao catálogo, desde que exista espaço.
     *
     * @param livro objeto livro a ser adicionado
     */
    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro não pode ser nulo.");
        }

        if (livros.size() >= LIMITE_LIVROS) {
            throw new IllegalStateException("O catálogo atingiu o limite máximo de 50 livros.");
        }

        livros.add(livro);
    }

    /**
     * Remove um livro do catálogo.
     *
     * @param livro livro a ser removido
     * @return true se a remoção foi bem-sucedida
     */
    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

    /**
     * Busca um livro pelo título, ignorando maiúsculas e minúsculas.
     *
     * @param titulo nome do livro
     * @return livro encontrado ou null
     */
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

    /**
     * Busca um livro pelo código interno.
     *
     * @param codigo código do livro
     * @return livro encontrado ou null
     */
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

    /**
     * Retorna a lista de livros do catálogo em modo somente leitura.
     *
     * @return cópia imutável da lista
     */
    public List<Livro> listarLivros() {
        return Collections.unmodifiableList(livros);
    }

    /**
     * Retorna a quantidade atual de livros cadastrados.
     *
     * @return número de itens
     */
    public int quantidadeLivros() {
        return livros.size();
    }

    /**
     * Verifica se o catálogo já atingiu a capacidade máxima.
     *
     * @return true se o limite foi alcançado
     */
    public boolean limiteAtingido() {
        return livros.size() >= LIMITE_LIVROS;
    }

    /**
     * Lista livros que contenham um trecho do nome da coleção ou tema informado.
     *
     * @param nomeColecao texto usado na busca
     * @return lista com os livros correspondentes
     * @throws IllegalArgumentException se o texto for nulo ou vazio
     */
    public List<Livro> listarLivrosPorColecao(String nomeColecao) {
        if (nomeColecao == null || nomeColecao.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome da coleção inválido para busca.");
        }
        List<Livro> livrosDaColecao = new ArrayList<>();
        for (Livro livro : livros) {
            if (livro.getTitulo().toLowerCase().contains(nomeColecao.trim().toLowerCase())) {
                livrosDaColecao.add(livro);
            }
        }
        return livrosDaColecao;
    }

    /**
     * Representação textual do catálogo para debug.
     *
     * @return resumo do catálogo
     */
    @Override
    public String toString() {
        return "Catalogo {quantidade=" + livros.size() + ", limite=" + LIMITE_LIVROS + ", livros=" + livros + '}';
    }
}
