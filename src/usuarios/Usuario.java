package usuarios;

import livros.Livro;

public class Usuario {
    private String nome;
    private String matricula;

    public Usuario(String nome, String matricula) {
        setNome(nome);
        setMatricula(matricula);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do usuário não pode ficar vazio.");
        }
        this.nome = nome.trim();
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        if (matricula == null || matricula.trim().isEmpty()) {
            throw new IllegalArgumentException("A matrícula não pode ficar vazia.");
        }
        this.matricula = matricula.trim();
    }

    public void realizarEmprestimo(Livro livro) {
        if (livro == null) {
            throw new IllegalArgumentException("O livro informado é inválido.");
        }

        System.out.println("Usuário: " + nome + " | Matrícula: " + matricula);
        System.out.println("Realizou o empréstimo do livro: " + livro.getTitulo());
    }

    @Override
    public String toString() {
        return "Usuario {nome='" + nome + '\'' +
                ", matricula='" + matricula + '\'' +
                '}';
    }
}
