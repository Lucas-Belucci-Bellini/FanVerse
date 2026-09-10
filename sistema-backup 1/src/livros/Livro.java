/**
 * Classe base que representa um livro genérico do sistema de biblioteca.
 * Possui atributos comuns a todos os livros e validações básicas.
 */
package livros;

public class Livro {
    private String titulo;
    private String autor;
    private int ano;
    private CodigoLivro codigoLivro;

    public Livro(String titulo, String autor, int ano) {
        setTitulo(titulo);
        setAutor(autor);
        setAno(ano);
        this.codigoLivro = new CodigoLivro();
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("O título do livro não pode ficar vazio.");
        }
        this.titulo = titulo.trim();
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        if (autor == null || autor.trim().isEmpty()) {
            throw new IllegalArgumentException("O autor não pode ficar vazio.");
        }
        this.autor = autor.trim();
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        if (ano <= 0) {
            throw new IllegalArgumentException("O ano deve ser maior que zero.");
        }
        this.ano = ano;
    }

    public CodigoLivro getCodigoLivro() {
        return codigoLivro;
    }

    protected void exibirDadosBasicos() {
        System.out.println("Título: " + titulo);
        System.out.println("Autor: " + autor);
        System.out.println("Ano: " + ano);
        System.out.println("Código do livro: " + codigoLivro.getCodigo());
        System.out.println("Identificação: " + codigoLivro.getIdentificacao());
    }

    public void apresentarDados() {
        exibirDadosBasicos();
    }

    public void exibirMensagem() {
        System.out.println("Mensagem padrão: este livro está disponível na biblioteca.");
    }

    public void exibirMensagem(String mensagem) {
        System.out.println(mensagem);
    }

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
