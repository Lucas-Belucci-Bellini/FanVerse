package livros;

public class LivroFisico extends Livro {
    private int quantidadePaginas;

    public LivroFisico(String titulo, String autor, int ano, int quantidadePaginas) {
        super(titulo, autor, ano);
        setQuantidadePaginas(quantidadePaginas);
    }

    public int getQuantidadePaginas() {
        return quantidadePaginas;
    }

    public void setQuantidadePaginas(int quantidadePaginas) {
        if (quantidadePaginas <= 0) {
            throw new IllegalArgumentException("A quantidade de páginas deve ser maior que zero.");
        }
        this.quantidadePaginas = quantidadePaginas;
    }

    @Override
    public void apresentarDados() {
        exibirDadosBasicos();
        System.out.println("Tipo: Livro Físico");
        System.out.println("Quantidade de páginas: " + quantidadePaginas);
    }

    public void folhear() {
        System.out.println("O livro físico '" + getTitulo() + "' está sendo folheado.");
    }

    @Override
    public String toString() {
        return "LivroFisico {" +
                "quantidadePaginas=" + quantidadePaginas +
                ", " + super.toString() +
                '}';
    }
}
