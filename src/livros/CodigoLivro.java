/**
 * Representa o código interno de um livro dentro da biblioteca.
 *
 * <p>Este objeto é criado pela própria classe {@link Livro}, o que demonstra a
 * relação de composição: um livro contém um código de identificação único, mas o
 * código não existe independentemente dele. Essa modelagem facilita a organização
 * interna de registros e a rastreabilidade do acervo.</p>
 */
package livros;

public class CodigoLivro {
    // Código único gerado automaticamente para identificar o livro no sistema.
    private String codigo;
    // Texto descritivo usado para identificar o registro de forma mais clara.
    private String identificacao;

    /**
     * Gera um código aleatório para o livro.
     *
     * <p>O padrão usa o prefixo LIV- seguido de um número aleatório de 4 dígitos.
     * Essa estratégia simples permite identificar cada obra sem banco de dados.</p>
     */
    public CodigoLivro() {
        this.codigo = "LIV-" + ((int) (Math.random() * 9000) + 1000);
        this.identificacao = "Registro interno da biblioteca";
    }

    /**
     * Retorna o código do livro.
     *
     * @return código identificador
     */
    public String getCodigo() {
        return codigo;
    }

    /**
     * Define um novo código, validando se o valor informado não está vazio.
     *
     * @param codigo novo código
     */
    public void setCodigo(String codigo) {
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new IllegalArgumentException("O código não pode ficar vazio.");
        }
        this.codigo = codigo.trim();
    }

    /**
     * Retorna a descrição do registro.
     *
     * @return identificação do código
     */
    public String getIdentificacao() {
        return identificacao;
    }

    /**
     * Define a identificação do registro.
     *
     * @param identificacao nova descrição do código
     */
    public void setIdentificacao(String identificacao) {
        if (identificacao == null || identificacao.trim().isEmpty()) {
            throw new IllegalArgumentException("A identificação não pode ficar vazia.");
        }
        this.identificacao = identificacao.trim();
    }

    /**
     * Texto resumido do objeto para logs e depuração.
     *
     * @return representação textual do código
     */
    @Override
    public String toString() {
        return "CodigoLivro {codigo='" + codigo + '\'' +
                ", identificacao='" + identificacao + '\'' +
                '}';
    }
}
