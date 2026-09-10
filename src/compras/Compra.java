/**
 * Estrutura base para a futura venda de livros digitais.
 * A implementação atual mantém a lógica simples e extensível para pagamentos e histórico.
 */
package compras;

import livros.Livro;
import usuarios.Usuario;

public class Compra {
    private static int contador = 1;

    private int idCompra;
    private Usuario comprador;
    private Livro livro;
    private double valor;
    private String dataCompra;
    private String status;

    public Compra(Usuario comprador, Livro livro, double valor, String dataCompra, String status) {
        setComprador(comprador);
        setLivro(livro);
        setValor(valor);
        setDataCompra(dataCompra);
        setStatus(status);
        this.idCompra = contador++;
    }

    public int getIdCompra() {
        return idCompra;
    }

    public Usuario getComprador() {
        return comprador;
    }

    public void setComprador(Usuario comprador) {
        if (comprador == null) {
            throw new IllegalArgumentException("O comprador não pode ser nulo.");
        }
        this.comprador = comprador;
    }

    public Livro getLivro() {
        return livro;
    }

    public void setLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro adquirido não pode ser nulo.");
        }
        this.livro = livro;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("O valor da compra deve ser maior que zero.");
        }
        this.valor = valor;
    }

    public String getDataCompra() {
        return dataCompra;
    }

    public void setDataCompra(String dataCompra) {
        if (dataCompra == null || dataCompra.trim().isEmpty()) {
            throw new IllegalArgumentException("A data da compra não pode ficar vazia.");
        }
        this.dataCompra = dataCompra.trim();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("O status da compra não pode ficar vazio.");
        }
        this.status = status.trim();
    }

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
