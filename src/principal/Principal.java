/**
 * Classe principal do sistema FanVerse.
 * Este ponto de entrada demonstra o uso de herança, polimorfismo, associação, agregação,
 * composição, sobrecarga, catálogo e estrutura futura para compras.
 */
package principal;

import java.util.ArrayList;
import java.util.List;

import biblioteca.Biblioteca;
import catalogo.Catalogo;
import colecoes.Colecao;
import compras.Compra;
import livros.Livro;
import livros.LivroDigital;
import livros.LivroFisico;
import usuarios.Usuario;

public class Principal {
    public static void main(String[] args) {
        System.out.println("=== Sistema de Biblioteca FanVerse ===\n");

        LivroDigital livroDigital = new LivroDigital("Crônicas da Baluarte - Arco 1", "Lucas Belucci Bellini", 2024, 150.5);
        LivroFisico livroFisico = new LivroFisico("A FanFic do Sol - Volume 1", "Lucas Belucci Bellini", 2025, 320);

        Usuario usuario = new Usuario("Ana Souza", "MATR-001");
        Biblioteca biblioteca = new Biblioteca("FanVerse Biblioteca", "São Paulo");
        biblioteca.associarUsuario(usuario);

        System.out.println("=== Mensagens sobrecarregadas ===");
        livroDigital.exibirMensagem();
        livroDigital.exibirMensagem("Mensagem personalizada: novo download liberado para o usuário.");
        livroFisico.exibirMensagem();
        livroFisico.exibirMensagem("Mensagem personalizada: novo exemplar disponível na prateleira.");

        System.out.println("\n=== Polimorfismo ===");
        Livro[] livros = {livroDigital, livroFisico};
        for (Livro livro : livros) {
            livro.apresentarDados();
            System.out.println();
        }

        System.out.println("=== Empréstimo ===");
        biblioteca.registrarEmprestimo(livroDigital);
        usuario.realizarEmprestimo(livroFisico);

        System.out.println("\n=== toString() ===");
        System.out.println(livroDigital);
        System.out.println(livroFisico);
        System.out.println(usuario);
        System.out.println(biblioteca);

        System.out.println("\n=== Métodos específicos ===");
        livroDigital.baixar();
        livroFisico.folhear();

        System.out.println("\n=== Uso de getters e setters ===");
        livroDigital.setTitulo("Crônicas da Baluarte - Arco 1 - Edição Especial");
        livroDigital.setAutor("Lucas Belucci Bellini");
        livroDigital.setAno(2026);
        livroDigital.setTamanhoArquivo(180.0);

        livroFisico.setTitulo("A FanFic do Sol - Volume 1 - Edição Revisada");
        livroFisico.setAutor("Lucas Belucci Bellini");
        livroFisico.setAno(2026);
        livroFisico.setQuantidadePaginas(360);

        System.out.println("Título do livro digital: " + livroDigital.getTitulo());
        System.out.println("Autor do livro físico: " + livroFisico.getAutor());
        System.out.println("Páginas do livro físico: " + livroFisico.getQuantidadePaginas());

        System.out.println("\n=== Coleção ===");
        Colecao colecao = new Colecao("Crônicas da Baluarte", "Coleção principal com arcos e capítulos da obra.", "Lucas Belucci Bellini");
        colecao.adicionarLivro(livroDigital);
        colecao.adicionarLivro(livroFisico);
        colecao.apresentarInformacoes();
        colecao.listarLivros();

        System.out.println("\n=== Catálogo ===");
        Catalogo catalogo = new Catalogo();
        catalogo.adicionarLivro(livroDigital);
        catalogo.adicionarLivro(livroFisico);

        List<Livro> livrosCatalogo = new ArrayList<>();
        for (int i = 0; i < 48; i++) {
            Livro livroTemporario = new LivroDigital("Livro digital de suporte " + i, "Lucas Belucci Bellini", 2026, 20 + i);
            livrosCatalogo.add(livroTemporario);
        }

        for (Livro livro : livrosCatalogo) {
            catalogo.adicionarLivro(livro);
        }

        System.out.println("Quantidade de livros no catálogo: " + catalogo.quantidadeLivros());
        System.out.println("Busca por título: " + catalogo.buscarPorTitulo("A FanFic do Sol - Volume 1 - Edição Revisada"));

        Livro livroLimite = new LivroFisico("Livro extra de verificação", "Lucas Belucci Bellini", 2026, 300);
        try {
            catalogo.adicionarLivro(livroLimite);
            System.out.println("Livro extra adicionado fora do limite.");
        } catch (IllegalStateException erro) {
            System.out.println("Limite do catálogo atingido: " + erro.getMessage());
        }

        System.out.println("\n=== Compra ===");
        Compra compra = biblioteca.registrarCompra(usuario, livroFisico, 49.90, "2026-09-09", "Pendente");
        System.out.println(compra);
    }
}
