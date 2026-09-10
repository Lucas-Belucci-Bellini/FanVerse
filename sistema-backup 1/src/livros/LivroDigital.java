/**
 * Classe que representa um livro digital.
 */
package livros;

public class LivroDigital extends Livro {
    private double tamanhoArquivo;

    public LivroDigital(String titulo, String autor, int ano, double tamanhoArquivo) {
        super(titulo, autor, ano);
        setTamanhoArquivo(tamanhoArquivo);
    }

    public double getTamanhoArquivo() {
        return tamanhoArquivo;
    }

    public void setTamanhoArquivo(double tamanhoArquivo) {
        if (tamanhoArquivo <= 0) {
            throw new IllegalArgumentException("O tamanho do arquivo deve ser maior que zero.");
        }
        this.tamanhoArquivo = tamanhoArquivo;
    }

    @Override
    public void apresentarDados() {
        exibirDadosBasicos();
        System.out.println("Tipo: Livro Digital");
        System.out.println("Tamanho do arquivo: " + tamanhoArquivo + " MB");
    }

    public void baixar() {
        System.out.println("O livro digital '" + getTitulo() + "' está sendo baixado.");
    }

    @Override
    public String toString() {
        return "LivroDigital {tamanhoArquivo=" + tamanhoArquivo +
                " MB, " + super.toString() +
                '}';
    }
}
