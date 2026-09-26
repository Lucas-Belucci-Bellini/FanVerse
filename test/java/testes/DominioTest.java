package testes;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import catalogo.Catalogo;
import colecoes.Colecao;
import colecoes.ColecaoLivros;
import compras.Compra;
import livros.Livro;
import livros.LivroDigital;
import livros.LivroFisico;
import usuarios.Usuario;

/**
 * Testes das regras do domínio Java, sem dependências externas (sem JUnit/Maven):
 * `npm run test:java` compila tudo e executa este main. Cada verificação que
 * falha é listada e o processo termina com código 1.
 */
public final class DominioTest {
    private static int executados = 0;
    private static final List<String> falhas = new ArrayList<>();

    private DominioTest() {
    }

    @FunctionalInterface
    private interface Corpo {
        void executar() throws Exception;
    }

    private static void teste(String nome, Corpo corpo) {
        executados++;
        try {
            corpo.executar();
            System.out.println("ok   - " + nome);
        } catch (Throwable erro) {
            falhas.add(nome + ": " + erro);
            System.out.println("FALHA - " + nome + " -> " + erro);
        }
    }

    private static void verificar(boolean condicao, String mensagem) {
        if (!condicao) {
            throw new AssertionError(mensagem);
        }
    }

    private static <T extends Throwable> T esperarErro(Class<T> tipo, Corpo corpo) {
        try {
            corpo.executar();
        } catch (Throwable erro) {
            if (tipo.isInstance(erro)) {
                return tipo.cast(erro);
            }
            throw new AssertionError("esperava " + tipo.getSimpleName() + ", veio " + erro);
        }
        throw new AssertionError("esperava " + tipo.getSimpleName() + ", nenhum erro lançado");
    }

    private static LivroDigital digital(String titulo) {
        return new LivroDigital(titulo, "Autor", 2024, 10.0);
    }

    public static void main(String[] args) {
        teste("Livro recusa título, autor e ano inválidos", () -> {
            esperarErro(IllegalArgumentException.class, () -> new LivroDigital(" ", "Autor", 2024, 1.0));
            esperarErro(IllegalArgumentException.class, () -> new LivroDigital("T", null, 2024, 1.0));
            esperarErro(IllegalArgumentException.class, () -> new LivroFisico("T", "Autor", 0, 10));
        });

        teste("Livro remove espaços das pontas do título e do autor", () -> {
            Livro livro = new LivroFisico("  Título  ", "  Autor ", 2024, 100);
            verificar(livro.getTitulo().equals("Título"), "título não foi aparado");
            verificar(livro.getAutor().equals("Autor"), "autor não foi aparado");
        });

        teste("LivroDigital exige tamanho > 0 e LivroFisico exige páginas > 0", () -> {
            esperarErro(IllegalArgumentException.class, () -> new LivroDigital("T", "A", 2024, 0));
            esperarErro(IllegalArgumentException.class, () -> new LivroFisico("T", "A", 2024, -1));
            LivroFisico fisico = new LivroFisico("T", "A", 2024, 10);
            esperarErro(IllegalArgumentException.class, () -> fisico.setQuantidadePaginas(0));
            verificar(fisico.getQuantidadePaginas() == 10, "valor inválido alterou o estado");
        });

        teste("códigos de livro são únicos (antes eram aleatórios e podiam repetir)", () -> {
            Set<String> codigos = new HashSet<>();
            for (int i = 0; i < 2000; i++) {
                String codigo = digital("L" + i).getCodigoLivro().getCodigo();
                verificar(codigo.matches("LIV-\\d{4,}"), "formato inesperado: " + codigo);
                verificar(codigos.add(codigo), "código repetido: " + codigo);
            }
        });

        teste("identificadores de coleção são únicos", () -> {
            Set<String> ids = new HashSet<>();
            for (int i = 0; i < 500; i++) {
                String id = new Colecao("C" + i, "Descrição", "Autor").getIdentificador();
                verificar(id.matches("COL-\\d{4,}"), "formato inesperado: " + id);
                verificar(ids.add(id), "identificador repetido: " + id);
            }
        });

        teste("Catalogo aceita até 50 livros e recusa o 51º", () -> {
            Catalogo catalogo = new Catalogo();
            for (int i = 0; i < Catalogo.getLimiteLivros(); i++) {
                catalogo.adicionarLivro(digital("L" + i));
            }
            verificar(catalogo.limiteAtingido(), "limite deveria estar atingido");
            esperarErro(IllegalStateException.class, () -> catalogo.adicionarLivro(digital("extra")));
            verificar(catalogo.quantidadeLivros() == 50, "quantidade mudou após recusa");
        });

        teste("Catalogo busca por título (sem diferenciar maiúsculas) e por código", () -> {
            Catalogo catalogo = new Catalogo();
            LivroDigital alvo = digital("Crônicas da Baluarte");
            catalogo.adicionarLivro(digital("Outro"));
            catalogo.adicionarLivro(alvo);
            verificar(catalogo.buscarPorTitulo("  crônicas DA baluarte ") == alvo, "busca por título falhou");
            verificar(catalogo.buscarPorCodigo(alvo.getCodigoLivro().getCodigo()) == alvo, "busca por código falhou");
            verificar(catalogo.buscarPorTitulo("inexistente") == null, "deveria devolver null");
            esperarErro(IllegalArgumentException.class, () -> catalogo.buscarPorTitulo(""));
        });

        teste("Catalogo.listarLivrosPorColecao filtra por trecho e recusa nulo", () -> {
            Catalogo catalogo = new Catalogo();
            catalogo.adicionarLivro(digital("Baluarte - Arco 1"));
            catalogo.adicionarLivro(digital("Sol - Volume 1"));
            verificar(catalogo.listarLivrosPorColecao(" baluarte ").size() == 1, "filtro por coleção falhou");
            esperarErro(IllegalArgumentException.class, () -> catalogo.listarLivrosPorColecao(null));
        });

        teste("lista do catálogo é somente leitura", () -> {
            Catalogo catalogo = new Catalogo();
            catalogo.adicionarLivro(digital("L"));
            esperarErro(UnsupportedOperationException.class, () -> catalogo.listarLivros().clear());
        });

        teste("ColecaoLivros limita a 50; Colecao comum não tem limite", () -> {
            ColecaoLivros limitada = new ColecaoLivros("C", "D", "A");
            Colecao livre = new Colecao("C", "D", "A");
            for (int i = 0; i < 50; i++) {
                limitada.adicionarLivro(digital("L" + i));
                livre.adicionarLivro(digital("L" + i));
            }
            esperarErro(IllegalStateException.class, () -> limitada.adicionarLivro(digital("extra")));
            livre.adicionarLivro(digital("extra"));
            verificar(livre.quantidadeLivros() == 51, "coleção comum deveria aceitar o 51º");
        });

        teste("Compra valida dados e gera IDs crescentes", () -> {
            Usuario usuario = new Usuario("Ana", "MATR-1");
            Livro livro = digital("L");
            esperarErro(IllegalArgumentException.class, () -> new Compra(usuario, livro, 0, "2026-01-01", "Pendente"));
            esperarErro(IllegalArgumentException.class, () -> new Compra(null, livro, 10, "2026-01-01", "Pendente"));
            Compra primeira = new Compra(usuario, livro, 10, "2026-01-01", "Pendente");
            Compra segunda = new Compra(usuario, livro, 10, "2026-01-01", "Pendente", "  ");
            verificar(segunda.getIdCompra() > primeira.getIdCompra(), "IDs de compra não são crescentes");
            verificar(segunda.getMetodoPagamento().equals("Não informado"), "método vazio deveria virar padrão");
            primeira.processarCompra();
            verificar(primeira.getStatus().equals("Concluída"), "processarCompra não concluiu");
        });

        teste("biblioteca.Compra (depreciada) continua compatível com compras.Compra", () -> {
            @SuppressWarnings("deprecation")
            compras.Compra antiga = new biblioteca.Compra(new Usuario("Ana", "M"), digital("L"), 5, "Pix");
            verificar(antiga.getStatus().equals("Pendente"), "status padrão mudou");
            verificar(antiga.getMetodoPagamento().equals("Pix"), "método de pagamento perdido");
        });

        System.out.println();
        System.out.println(executados + " testes, " + falhas.size() + " falha(s).");
        if (!falhas.isEmpty()) {
            System.exit(1);
        }
    }
}
