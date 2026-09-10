/**
 * Classe principal do sistema de biblioteca.
 * Demonstra herança, polimorfismo, composição, associação e agregação.
 */
package principal;

import biblioteca.Biblioteca;
import livros.Livro;
import livros.LivroDigital;
import livros.LivroFisico;
import usuarios.Usuario;

public class Principal {
    public static void main(String[] args) {
        System.out.println("=== Sistema de Biblioteca ===\n");

        LivroDigital livroDigital = new LivroDigital("Crônicas da Baluarte", "Lucas Bellini", 2024, 150.5);
        LivroFisico livroFisico = new LivroFisico("A FanFic do Sol", "Lucas Bellini", 2025, 320);

        Usuario usuario = new Usuario("Ana Souza", "MATR-001");
        Biblioteca biblioteca = new Biblioteca("Biblioteca FanVerse", "São Paulo");
        biblioteca.associarUsuario(usuario);

        System.out.println("=== Mensagens sobrecarregadas ===");
        livroDigital.exibirMensagem();
        livroDigital.exibirMensagem("Mensagem personalizada: download liberado.");
        livroFisico.exibirMensagem();
        livroFisico.exibirMensagem("Mensagem personalizada: livro disponível na estante.");

        System.out.println("\n=== Polimorfismo ===");
        Livro[] livros = {livroDigital, livroFisico};
        for (Livro livro : livros) {
            livro.apresentarDados();
            System.out.println();
        }

        System.out.println("=== Empréstimo ===");
        biblioteca.registrarEmprestimo(livroDigital);
        usuario.realizarEmprestimo(livroFisico);

        System.out.println("\n=== toString ===");
        System.out.println(livroDigital);
        System.out.println(livroFisico);
        System.out.println(usuario);
        System.out.println(biblioteca);

        System.out.println("\n=== Métodos específicos ===");
        livroDigital.baixar();
        livroFisico.folhear();

        System.out.println("\n=== Getters e setters ===");
        livroDigital.setTitulo("Crônicas da Baluarte - Edição Especial");
        livroDigital.setAutor("Lucas Bellini");
        livroDigital.setAno(2026);
        livroDigital.setTamanhoArquivo(180.0);

        livroFisico.setTitulo("A FanFic do Sol - Volume 1");
        livroFisico.setAutor("Lucas Bellini");
        livroFisico.setAno(2026);
        livroFisico.setQuantidadePaginas(360);

        System.out.println("Título do livro digital: " + livroDigital.getTitulo());
        System.out.println("Autor do livro físico: " + livroFisico.getAutor());
        System.out.println("Paginas do livro físico: " + livroFisico.getQuantidadePaginas());
    }
}
