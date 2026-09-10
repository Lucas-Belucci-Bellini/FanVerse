/**
 * Representa a biblioteca física e a camada de relacionamento com usuários.
 * A biblioteca agrega um usuário que pode existir independentemente do ambiente da biblioteca.
 */
package biblioteca;

import compras.Compra;
import livros.Livro;
import usuarios.Usuario;

public class Biblioteca {
    private String nome;
    private String cidade;
    private Usuario usuario;

    public Biblioteca(String nome, String cidade) {
        setNome(nome);
        setCidade(cidade);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da biblioteca não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        if (cidade == null || cidade.trim().isEmpty()) {
            throw new IllegalArgumentException("A cidade da biblioteca não pode ficar vazia.");
        }
        this.cidade = cidade.trim();
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void associarUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void registrarEmprestimo(Livro livro) {
        if (usuario == null) {
            System.out.println("A biblioteca ainda não possui um usuário associado.");
            return;
        }

        usuario.realizarEmprestimo(livro);
    }

    public Compra registrarCompra(Usuario usuario, Livro livro, double valor, String dataCompra, String status) {
        if (usuario == null || livro == null) {
            throw new IllegalArgumentException("Usuário e livro precisam estar preenchidos.");
        }

        Compra compra = new Compra(usuario, livro, valor, dataCompra, status);
        System.out.println("Compra registrada com sucesso para o livro: " + livro.getTitulo());
        return compra;
    }

    @Override
    public String toString() {
        return "Biblioteca {nome='" + nome + '\'' +
                ", cidade='" + cidade + '\'' +
                ", usuario=" + usuario +
                '}';
    }
}
