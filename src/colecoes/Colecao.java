/**
 * Agrupa livros em uma coleção temática ou narrativa.
 *
 * <p>Essa classe funciona como um conjunto de livros pertencentes à mesma obra,
 * série ou linha editorial. Ela é especialmente útil para fanfictions e narrativas
 * em arcos, pois permite agrupar vários volumes sob uma mesma identidade.</p>
 */
package colecoes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import livros.Livro;

public class Colecao {
    // Nome da coleção ou série.
    private String nome;
    // Descrição geral da coleção.
    private String descricao;
    // Autor responsável pela coleção.
    private String autor;
    // Identificador único da coleção.
    private String identificador;
    // Sequência compartilhada: identificadores distintos na mesma execução (antes era aleatório).
    private static final AtomicInteger SEQUENCIA = new AtomicInteger(1);
    // Lista dos livros pertencentes a esta coleção.
    private List<Livro> livros;

    /**
     * Cria uma coleção válida com nome, descrição e autor.
     *
     * @param nome nome da coleção
     * @param descricao descrição da coleção
     * @param autor autor da obra ou série
     */
    public Colecao(String nome, String descricao, String autor) {
        setNome(nome);
        setDescricao(descricao);
        setAutor(autor);
        this.identificador = String.format("COL-%04d", SEQUENCIA.getAndIncrement());
        this.livros = new ArrayList<>();
    }

    /**
     * Retorna o nome da coleção.
     *
     * @return nome
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome da coleção.
     *
     * @param nome novo nome
     */
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da coleção não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    /**
     * Retorna a descrição da coleção.
     *
     * @return descrição
     */
    public String getDescricao() {
        return descricao;
    }

    /**
     * Define a descrição da coleção.
     *
     * @param descricao nova descrição
     */
    public void setDescricao(String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição da coleção não pode ficar vazia.");
        }
        this.descricao = descricao.trim();
    }

    /**
     * Retorna o autor da coleção.
     *
     * @return autor
     */
    public String getAutor() {
        return autor;
    }

    /**
     * Define o autor da coleção.
     *
     * @param autor novo autor
     */
    public void setAutor(String autor) {
        if (autor == null || autor.trim().isEmpty()) {
            throw new IllegalArgumentException("O autor da coleção não pode ficar vazio.");
        }
        this.autor = autor.trim();
    }

    /**
     * Retorna o identificador único da coleção.
     *
     * @return código da coleção
     */
    public String getIdentificador() {
        return identificador;
    }

    /**
     * Retorna os livros da coleção em formato somente leitura.
     *
     * @return lista imutável dos livros
     */
    public List<Livro> getLivros() {
        return Collections.unmodifiableList(livros);
    }

    /**
     * Adiciona um livro à coleção.
     *
     * @param livro livro a ser incluído
     */
    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("Livro inválido para a coleção.");
        }
        livros.add(livro);
    }

    /**
     * Remove um livro da coleção.
     *
     * @param livro livro a ser removido
     * @return true se a remoção foi bem-sucedida
     */
    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

    /**
     * Busca um livro pelo título dentro da coleção.
     *
     * @param titulo título da obra
     * @return livro encontrado ou null
     */
    public Livro procurarLivroPorTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("O título informado é inválido.");
        }

        for (Livro livro : livros) {
            if (livro.getTitulo().equalsIgnoreCase(titulo.trim())) {
                return livro;
            }
        }

        return null;
    }

    /**
     * Retorna um livro pela posição dele na lista.
     *
     * @param indice posição do livro
     * @return livro da posição solicitada
     */
    public Livro obterLivroPorPosicao(int indice) {
        if (indice < 0 || indice >= livros.size()) {
            throw new IndexOutOfBoundsException("Índice fora do intervalo da coleção.");
        }
        return livros.get(indice);
    }

    /**
     * Retorna a quantidade de livros presentes na coleção.
     *
     * @return total de livros
     */
    public int quantidadeLivros() {
        return livros.size();
    }

    /**
     * Lista todos os títulos presentes na coleção.
     */
    public void listarLivros() {
        if (livros.isEmpty()) {
            System.out.println("A coleção está vazia.");
            return;
        }

        System.out.println("Livros da coleção '" + nome + "':");
        for (Livro livro : livros) {
            System.out.println("- " + livro.getTitulo());
        }
    }

    /**
     * Exibe as informações principais da coleção.
     */
    public void apresentarInformacoes() {
        System.out.println("Coleção: " + nome);
        System.out.println("Descrição: " + descricao);
        System.out.println("Autor: " + autor);
        System.out.println("Identificador: " + identificador);
        System.out.println("Quantidade de livros: " + livros.size());
    }

    /**
     * Texto resumido da coleção para depuração.
     *
     * @return representação textual da coleção
     */
    @Override
    public String toString() {
        return "Colecao {nome='" + nome + '\'' +
                ", descricao='" + descricao + '\'' +
                ", autor='" + autor + '\'' +
                ", identificador='" + identificador + '\'' +
                ", livros=" + livros +
                '}';
    }
}
