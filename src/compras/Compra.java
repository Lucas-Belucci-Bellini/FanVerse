/**
 * Estrutura base para futuras vendas e registros de compra do sistema.
 *
 * <p>Essa classe representa uma transação comercial mais detalhada do que a classe
 * localizada em {@code biblioteca.Compra}. Ela guarda um identificador, a data da compra,
 * o status e o comprador, servindo como base para a evolução do sistema para uma loja
 * ou integração com pagamentos reais.</p>
 */
package compras;

import livros.Livro;
import usuarios.Usuario;

public class Compra {
    // Controle de identificadores únicos para cada transação.
    private static int contador = 1;

    // Código do registro financeiro da compra.
    private int idCompra;
    // Usuário que efetuou a compra.
    private Usuario comprador;
    // Livro adquirido.
    private Livro livro;
    // Valor da transação.
    private double valor;
    // Data em que a compra foi realizada.
    private String dataCompra;
    // Status atual do pedido, como pendente, concluído ou cancelado.
    private String status;

    /**
     * Cria uma compra com dados básicos e gera um identificador único.
     *
     * @param comprador usuário que efetuou a compra
     * @param livro obra adquirida
     * @param valor valor da transação
     * @param dataCompra data em formato textual
     * @param status situação atual da compra
     */
    public Compra(Usuario comprador, Livro livro, double valor, String dataCompra, String status) {
        setComprador(comprador);
        setLivro(livro);
        setValor(valor);
        setDataCompra(dataCompra);
        setStatus(status);
        this.idCompra = contador++;
    }

    /**
     * Retorna o identificador da compra.
     *
     * @return id da transação
     */
    public int getIdCompra() {
        return idCompra;
    }

    /**
     * Retorna o comprador.
     *
     * @return usuário que efetuou a compra
     */
    public Usuario getComprador() {
        return comprador;
    }

    /**
     * Define o comprador da compra.
     *
     * @param comprador usuário comprador
     */
    public void setComprador(Usuario comprador) {
        if (comprador == null) {
            throw new IllegalArgumentException("O comprador não pode ser nulo.");
        }
        this.comprador = comprador;
    }

    /**
     * Retorna o livro relacionado à compra.
     *
     * @return livro adquirido
     */
    public Livro getLivro() {
        return livro;
    }

    /**
     * Define o livro da transação.
     *
     * @param livro obra vendida
     */
    public void setLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro adquirido não pode ser nulo.");
        }
        this.livro = livro;
    }

    /**
     * Retorna o valor da compra.
     *
     * @return valor monetário
     */
    public double getValor() {
        return valor;
    }

    /**
     * Define o valor da compra com validação.
     *
     * @param valor valor da compra
     */
    public void setValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("O valor da compra deve ser maior que zero.");
        }
        this.valor = valor;
    }

    /**
     * Retorna a data da compra.
     *
     * @return data em string
     */
    public String getDataCompra() {
        return dataCompra;
    }

    /**
     * Define a data da compra.
     *
     * @param dataCompra data da operação
     */
    public void setDataCompra(String dataCompra) {
        if (dataCompra == null || dataCompra.trim().isEmpty()) {
            throw new IllegalArgumentException("A data da compra não pode ficar vazia.");
        }
        this.dataCompra = dataCompra.trim();
    }

    /**
     * Retorna o status da compra.
     *
     * @return estado da transação
     */
    public String getStatus() {
        return status;
    }

    /**
     * Define o status da compra.
     *
     * @param status novo estado da transação
     */
    public void setStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("O status da compra não pode ficar vazio.");
        }
        this.status = status.trim();
    }

    /**
     * Representação textual da compra para debug.
     *
     * @return resumo do registro da compra
     */
    @Override
    public String toString() {
        return "Compra {idCompra=" + idCompra +
                ", comprador=" + comprador +
                ", livro=" + livro +
                ", valor=" + valor +
                ", dataCompra='" + dataCompra + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
