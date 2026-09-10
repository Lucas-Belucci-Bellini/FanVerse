/**
 * Representa uma coleção de livros pertencentes a uma mesma obra, arco ou série.
 * A estrutura foi criada para permitir organização futura de narrativas e capítulos.
 */
package colecoes;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import livros.Livro;

public class Colecao {
    private String nome;
    private String descricao;
    private String autor;
    private String identificador;
    private List<Livro> livros;

    public Colecao(String nome, String descricao, String autor) {
        setNome(nome);
        setDescricao(descricao);
        setAutor(autor);
        this.identificador = "COL-" + ((int) (Math.random() * 9000) + 1000);
        this.livros = new ArrayList<>();
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da coleção não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição da coleção não pode ficar vazia.");
        }
        this.descricao = descricao.trim();
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        if (autor == null || autor.trim().isEmpty()) {
            throw new IllegalArgumentException("O autor da coleção não pode ficar vazio.");
        }
        this.autor = autor.trim();
    }

    public String getIdentificador() {
        return identificador;
    }

    public List<Livro> getLivros() {
        return Collections.unmodifiableList(livros);
    }

    public void adicionarLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("Livro inválido para a coleção.");
        }
        livros.add(livro);
    }

    public boolean removerLivro(Livro livro) {
        return livros.remove(livro);
    }

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

    public Livro obterLivroPorPosicao(int indice) {
        if (indice < 0 || indice >= livros.size()) {
            throw new IndexOutOfBoundsException("Índice fora do intervalo da coleção.");
        }
        return livros.get(indice);
    }

    public int quantidadeLivros() {
        return livros.size();
    }

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

    public void apresentarInformacoes() {
        System.out.println("Coleção: " + nome);
        System.out.println("Descrição: " + descricao);
        System.out.println("Autor: " + autor);
        System.out.println("Identificador: " + identificador);
        System.out.println("Quantidade de livros: " + livros.size());
    }

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
