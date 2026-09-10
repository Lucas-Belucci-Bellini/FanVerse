/**
 * Representa uma compra de um livro realizada no contexto da biblioteca.
 *
 * <p>Essa classe encapsula a transação de venda, incluindo usuário, livro, valor e
 * método de pagamento. Ela permite acompanhar se a compra foi concluída e também
 * serve como exemplo de classe de domínio para operações comerciais.</p>
 */
package biblioteca;

import livros.Livro;
import usuarios.Usuario;

public class Compra {
    // Usuário que realizou a compra.
    private Usuario usuario;
    // Livro adquirido.
    private Livro livro;
    // Valor total da transação.
    private double valor;
    // Forma de pagamento escolhida pelo usuário.
    private String metodoPagamento;
    // Indica se a compra já foi finalizada.
    private boolean concluida;

    /**
     * Cria uma compra válida com usuário, livro, valor e forma de pagamento.
     *
     * @param usuario comprador
     * @param livro livro adquirido
     * @param valor valor da compra
     * @param metodoPagamento forma de pagamento
     */
    public Compra(Usuario usuario, Livro livro, double valor, String metodoPagamento) {
        setUsuario(usuario);
        setLivro(livro);
        setValor(valor);
        setMetodoPagamento(metodoPagamento);
        this.concluida = false;
    }

    /**
     * Retorna o cliente da compra.
     *
     * @return usuário
     */
    public Usuario getUsuario() {
        return usuario;
    }

    /**
     * Define o usuário da compra e valida a informação.
     *
     * @param usuario usuário comprador
     */
    public void setUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("O usuário da compra não pode ser nulo.");
        }
        this.usuario = usuario;
    }

    /**
     * Retorna o livro adquirido.
     *
     * @return livro
     */
    public Livro getLivro() {
        return livro;
    }

    /**
     * Define o livro da compra e valida a informação.
     *
     * @param livro livro a ser comprado
     */
    public void setLivro(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro da compra não pode ser nulo.");
        }
        this.livro = livro;
    }

    /**
     * Retorna o valor da compra.
     *
     * @return valor da transação
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
     * Retorna o método de pagamento.
     *
     * @return forma de pagamento
     */
    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    /**
     * Define o método de pagamento com validação.
     *
     * @param metodoPagamento forma de pagamento
     */
    public void setMetodoPagamento(String metodoPagamento) {
        if (metodoPagamento == null || metodoPagamento.trim().isEmpty()) {
            throw new IllegalArgumentException("O método de pagamento não pode ficar vazio.");
        }
        this.metodoPagamento = metodoPagamento.trim();
    }

    /**
     * Retorna se a compra foi concluída.
     *
     * @return status da compra
     */
    public boolean isConcluida() {
        return concluida;
    }

    /**
     * Processa a finalização da compra.
     *
     * <p>Ao chamar este método, a operação passa a ficar marcada como concluída e a
     * saída mostra os principais dados da transação.</p>
     */
    public void processarCompra() {
        this.concluida = true;
        System.out.println("Compra concluída com sucesso!");
        System.out.println("Usuário: " + usuario.getNome());
        System.out.println("Livro: " + livro.getTitulo());
        System.out.println("Valor: R$ " + valor);
        System.out.println("Pagamento: " + metodoPagamento);
    }

    /**
     * Representação textual da compra para logs e depuração.
     *
     * @return resumo da compra
     */
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
