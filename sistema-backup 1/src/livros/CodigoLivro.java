/**
 * Classe auxiliar usada como composição dentro de Livro.
 * Representa o código e a identificação interna do livro.
 */
package livros;

public class CodigoLivro {
    private String codigo;
    private String identificacao;

    public CodigoLivro() {
        this.codigo = gerarCodigo();
        this.identificacao = "Registro interno da biblioteca";
    }

    private String gerarCodigo() {
        return "LIV-" + ((int) (Math.random() * 9000 + 1000));
    }

    public String getCodigo() {
        return codigo;
    }

    public String getIdentificacao() {
        return identificacao;
    }

    @Override
    public String toString() {
        return "CodigoLivro {codigo='" + codigo + '\'' +
                ", identificacao='" + identificacao + '\'' +
                '}';
    }
}
