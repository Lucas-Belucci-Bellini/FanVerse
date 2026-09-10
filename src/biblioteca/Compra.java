/**
 * Representa uma compra de um livro realizado pela biblioteca.
 * A classe registra o usuário, o livro adquirido, o valor e a forma de pagamento.
 */
package biblioteca;

import livros.Livro;
import usuarios.Usuario;

public class Compra {
    private Usuario usuario;
    private Livro livro;
    private double valor;
    private String metodoPagamento;
    private boolean concluida;

    public Compra(Usuario usuario, Livro livro, double valor, String metodoPagamento) {
        setUsuario(usuario);
        setLivro(livro);
        setValor(valor);
        setMetodoPagamento(metodoPagamento);
        this.concluida = false;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("O usuário da compra não pode ser nulo.");
        }
        this.usuario = usuario;
    }

    public Livro getLivro() {
        return livro;
    }

    public void setLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro da compra não pode ser nulo.");
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

    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        if (metodoPagamento == null || metodoPagamento.trim().isEmpty()) {
            throw new IllegalArgumentException("O método de pagamento não pode ficar vazio.");
        }
        this.metodoPagamento = metodoPagamento.trim();
    }

    public boolean isConcluida() {
        return concluida;
    }

    public void processarCompra() {
        this.concluida = true;
        System.out.println("Compra concluída com sucesso!");
        System.out.println("Usuário: " + usuario.getNome());
        System.out.println("Livro: " + livro.getTitulo());
        System.out.println("Valor: R$ " + valor);
        System.out.println("Pagamento: " + metodoPagamento);
    }

    @Override
    public String toString() {
        return "Compra {" +
                "usuario=" + usuario +
                ", livro=" + livro +
                ", valor=" + valor +
                ", metodoPagamento='" + metodoPagamento + '\'' +
                ", concluida=" + concluida +
                '}';
    }
}
