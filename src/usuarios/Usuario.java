/**
 * Modela um usuário do sistema.
 *
 * <p>Essa classe representa alguém que pode realizar empréstimos e interagir com a
 * biblioteca. O usuário é um dado importante para o domínio da aplicação, pois ele
 * conecta a pessoa ao acervo e às operações de uso do sistema.</p>
 */
package usuarios;

import livros.Livro;

public class Usuario {
    // Nome da pessoa vinculada ao sistema.
    private String nome;
    // Identificador institucional da pessoa.
    private String matricula;

    /**
     * Cria um usuário com validação de dados obrigatórios.
     *
     * @param nome nome completo do usuário
     * @param matricula matrícula ou identificação institucional
     */
    public Usuario(String nome, String matricula) {
        setNome(nome);
        setMatricula(matricula);
    }

    /**
     * Retorna o nome do usuário.
     *
     * @return nome completo
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome do usuário após validar se o valor não está vazio.
     *
     * @param nome novo nome
     */
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do usuário não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    /**
     * Retorna a matrícula do usuário.
     *
     * @return matrícula
     */
    public String getMatricula() {
        return matricula;
    }

    /**
     * Define a matrícula do usuário.
     *
     * @param matricula nova matrícula
     */
    public void setMatricula(String matricula) {
        if (matricula == null || matricula.trim().isEmpty()) {
            throw new IllegalArgumentException("A matrícula não pode ficar vazia.");
        }
        this.matricula = matricula.trim();
    }

    /**
     * Simula a ação de empréstimo de um livro para este usuário.
     *
     * @param livro livro que será emprestado
     */
    public void realizarEmprestimo(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro informado é inválido.");
        }

        System.out.println("Usuário: " + nome + " | Matrícula: " + matricula);
        System.out.println("Realizou o empréstimo do livro: " + livro.getTitulo());
    }

    /**
     * Representação textual do usuário para logs e testes.
     *
     * @return resumo do usuário
     */
    @Override
    public String toString() {
        return "Usuario {nome='" + nome + '\'' +
                ", matricula='" + matricula + '\'' +
                '}';
    }
}
