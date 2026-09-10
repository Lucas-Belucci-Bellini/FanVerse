/**
 * Compatibilidade com versões anteriores do domínio de compra.
 *
 * <p>Essa classe foi mantida apenas para evitar que código antigo que referenciei
 * {@code biblioteca.Compra} quebre ao migrar para o modelo unificado em
 * {@code compras.Compra}. O domínio oficial passou a usar a classe em {@code compras}.</p>
 */
package biblioteca;

import livros.Livro;
import usuarios.Usuario;

@Deprecated
public class Compra extends compras.Compra {
    /**
     * Cria uma compra compatível com o modelo antigo.
     *
     * @param usuario comprador
     * @param livro livro adquirido
     * @param valor valor da compra
     * @param metodoPagamento forma de pagamento
     */
    public Compra(Usuario usuario, Livro livro, double valor, String metodoPagamento) {
        super(usuario, livro, valor, java.time.LocalDate.now().toString(), "Pendente", metodoPagamento);
    }

    /**
     * Cria uma compra compatível com o modelo antigo e com data/status explícitos.
     *
     * @param usuario comprador
     * @param livro livro adquirido
     * @param valor valor da compra
     * @param dataCompra data da transação
     * @param status estado da compra
     */
    public Compra(Usuario usuario, Livro livro, double valor, String dataCompra, String status) {
        super(usuario, livro, valor, dataCompra, status);
    }
}

