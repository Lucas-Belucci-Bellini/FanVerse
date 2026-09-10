/**
 * Representa a biblioteca como entidade central do sistema.
 *
 * <p>Essa classe reúne dados da instituição e também a relação com o usuário atual.
 * A biblioteca não é apenas um local físico, mas também o ponto de integração para
 * empréstimos e compras de livros dentro do domínio.</p>
 */
package biblioteca;

import compras.Compra;
import livros.Livro;
import usuarios.Usuario;

public class Biblioteca {
    // Nome da biblioteca ou unidade responsável pelo acervo.
    private String nome;
    // Cidade em que a biblioteca está localizada.
    private String cidade;
    // Usuário que está associado à biblioteca no momento de uso.
    private Usuario usuario;

    /**
     * Cria uma biblioteca com nome e cidade definidos.
     *
     * @param nome nome da biblioteca
     * @param cidade cidade de localização
     */
    public Biblioteca(String nome, String cidade) {
        setNome(nome);
        setCidade(cidade);
    }

    /**
     * Retorna o nome da biblioteca.
     *
     * @return nome da biblioteca
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome da biblioteca.
     *
     * @param nome novo nome
     */
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da biblioteca não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    /**
     * Retorna a cidade da biblioteca.
     *
     * @return cidade
     */
    public String getCidade() {
        return cidade;
    }

    /**
     * Define a cidade da biblioteca.
     *
     * @param cidade nome da cidade
     */
    public void setCidade(String cidade) {
        if (cidade == null || cidade.trim().isEmpty()) {
            throw new IllegalArgumentException("A cidade da biblioteca não pode ficar vazia.");
        }
        this.cidade = cidade.trim();
    }

    /**
     * Retorna o usuário associado.
     *
     * @return usuário atual da biblioteca
     */
    public Usuario getUsuario() {
        return usuario;
    }

    /**
     * Define diretamente o usuário associado à biblioteca.
     *
     * @param usuario usuário a ser vinculado
     */
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    /**
     * Alias para associar um usuário à biblioteca.
     *
     * @param usuario usuário que será associado
     */
    public void associarUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    /**
     * Registra o empréstimo de um livro para o usuário associado.
     *
     * @param livro livro que será emprestado
     */
    public void registrarEmprestimo(Livro livro) {
        if (usuario == null) {
            System.out.println("A biblioteca ainda não possui um usuário associado.");
            return;
        }

        usuario.realizarEmprestimo(livro);
    }

    /**
     * Registra uma compra na biblioteca.
     *
     * @param usuario usuário que realizou a compra
     * @param livro livro adquirido
     * @param valor valor da compra
     * @param dataCompra data da operação
     * @param status status atual da transação
     * @return objeto de compra gerado
     */
    public Compra registrarCompra(Usuario usuario, Livro livro, double valor, String dataCompra, String status) {
        if (usuario == null || livro == null) {
            throw new IllegalArgumentException("Usuário e livro precisam estar preenchidos.");
        }

        Compra compra = new Compra(usuario, livro, valor, dataCompra, status);
        System.out.println("Compra registrada com sucesso para o livro: " + livro.getTitulo());
        return compra;
    }

    /**
     * Representação textual da biblioteca.
     *
     * @return string resumida da biblioteca
     */
    @Override
    public String toString() {
        return "Biblioteca {nome='" + nome + '\'' +
                ", cidade='" + cidade + '\'' +
                ", usuario=" + usuario +
                '}';
    }
}
