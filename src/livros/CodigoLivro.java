/**
 * Representa o código interno de um livro dentro da biblioteca.
 * A criação deste objeto é responsabilidade da própria classe Livro,
 * configurando a relação de composição entre as classes.
 */
package livros;

public class CodigoLivro {
    private String codigo;
    private String identificacao;

    public CodigoLivro() {
        this.codigo = "LIV-" + ((int) (Math.random() * 9000) + 1000);
        this.identificacao = "Registro interno da biblioteca";
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new IllegalArgumentException("O código não pode ficar vazio.");
        }
        this.codigo = codigo.trim();
    }

    public String getIdentificacao() {
        return identificacao;
    }

    public void setIdentificacao(String identificacao) {
        if (identificacao == null || identificacao.trim().isEmpty()) {
            throw new IllegalArgumentException("A identificação não pode ficar vazia.");
        }
        this.identificacao = identificacao.trim();
    }

    @Override
    public String toString() {
        return "CodigoLivro {codigo='" + codigo + '\'' +
                ", identificacao='" + identificacao + '\'' +
                '}';
    }
}
