# FanVerse — Modelo de Dados

O projeto tem **dois modelos independentes**, que representam conceitos parecidos mas não são
sincronizados (DEC-009):

1. **Catálogo web** — JSON em `data/catalogo.json`, contrato v1, validado por `shared/catalog.js`.
2. **Domínio Java** — classes em `src/**/*.java`, vivem só em memória durante a execução.

---

## 1. Catálogo web (contrato v1)

### 1.1 Estrutura

```text
Catalog
├── schemaVersion        (1)
├── author               Author
└── collections[]        Collection
     └── arcs[]          Arc
          └── books[]    Book
```

Confirmado no código: é exatamente essa a hierarquia lida pela API (`flattenBooks`), pelo
frontend e pelo `site/`. Não existe entidade de usuário, compra ou biblioteca no JSON.

### 1.2 Origem dos dados

| Onde | Papel |
|---|---|
| `data/catalogo.json` | **Fonte de verdade.** Gravado só pelo `PUT /api/catalogo` (ou edição manual validada) |
| Build do Vite | Embute uma cópia do JSON como último recurso quando a API não responde |
| `localStorage` (`fanverse:catalog:v2`) | Cache da última leitura + alterações ainda não enviadas (DEC-007) |
| `site/assets/js/data.js` | **Gerado** do JSON (`npm run sync:site-data`); não editar |

### 1.3 Regras gerais

- Tipos são estritos: número é `number` JSON (`"9.90"` como texto é recusado).
- Campos marcados como opcionais podem faltar ou ser `null`.
- **Campos desconhecidos são preservados** (compatibilidade para frente) — não são validados.
- IDs: minúsculas, dígitos e hífens (`^[a-z0-9]+(-[a-z0-9]+)*$`), até 80 caracteres.
- URLs (`photo`, `cover`): `http(s)://…` ou caminho relativo. `javascript:`, `data:` etc. são recusados.
- Validar localmente: `npm run validate:data`.

### 1.4 Catalog

| Campo | Tipo | Obrig. | Regra |
|---|---|---|---|
| `schemaVersion` | inteiro | não | Se presente, `1`. Ausente = v1. O servidor sempre grava `1`. |
| `author` | Author | **sim** | |
| `collections` | Collection[] | **sim** | até 200 |

### 1.5 Author

| Campo | Tipo | Obrig. | Regra |
|---|---|---|---|
| `name` | texto | **sim** | não vazio, ≤ 200 |
| `bio` | texto | não | ≤ 5000 |
| `location` | texto | não | ≤ 200 |
| `specialty` | texto | não | ≤ 200 |
| `photo` | URL | não | ver 1.3 |

### 1.6 Collection

| Campo | Tipo | Obrig. | Regra |
|---|---|---|---|
| `id` | ID | **sim** | único entre coleções |
| `title` | texto | **sim** | não vazio, ≤ 200 |
| `description` | texto | não | ≤ 5000 |
| `author` | texto | não | ≤ 200 (nome exibido; não é referência a `Author`) |
| `year` | inteiro | não | 1–9999 |
| `cover` | URL | não | |
| `arcs` | Arc[] | **sim** | até 200 (pode ser vazia) |

### 1.7 Arc

| Campo | Tipo | Obrig. | Regra |
|---|---|---|---|
| `id` | ID | **sim** | único **dentro da coleção** (coleções diferentes podem repetir `arco-01`) |
| `number` | inteiro | **sim** | ≥ 1 |
| `title` | texto | **sim** | não vazio, ≤ 200 |
| `description` | texto | não | ≤ 5000 |
| `status` | texto | não | ≤ 60 — rótulo livre (hoje `"Disponível"`) |
| `books` | Book[] | **sim** | até 500 |

### 1.8 Book

| Campo | Tipo | Obrig. | Regra |
|---|---|---|---|
| `id` | ID | **sim** | **único no catálogo inteiro** (é a chave de `GET /api/catalogo/book/:id`) |
| `title` | texto | **sim** | não vazio, ≤ 200 |
| `description` | texto | não | ≤ 5000 |
| `type` | enum | **sim** | `"digital"` ou `"fisico"` |
| `price` | número | **sim** | finito, 0 ≤ preço ≤ 100000 (reais; 0 = gratuito) |
| `status` | texto | não | ≤ 60 — rótulo de UI (`"Ler agora"`, `"Em breve"`…) |
| `availability` | texto | não | ≤ 60 — código (`"DIGITAL_DISPONIVEL"`) |
| `year` | inteiro | não | 1–9999 |
| `chapters` | inteiro | não | ≥ 0 |
| `cover` | URL | não | |
| `content` | texto | não | ≤ 500 000 — texto de leitura (parágrafos separados por `\n\n`) |

> `status` e `availability` têm papéis sobrepostos e valores livres. Normalizá-los em enums é uma
> mudança de schema (v2) registrada no roadmap, não feita agora (AUDIT D-09).

### 1.9 Forma derivada: livro "achatado"

`GET /api/catalogo/books` e `book/:id` devolvem o Book com quatro campos a mais, calculados
(não gravados): `collectionId`, `collectionTitle`, `arcId`, `arcTitle`.

### 1.10 Regras de negócio do editor (`addBook`)

- Coleção encontrada pelo título, sem diferenciar maiúsculas; se não existir, é criada com ID
  derivado do título (`Contos do Norte` → `contos-do-norte`).
- Coleção sem arcos ganha `arco-01`. O livro entra no **primeiro arco**.
- ID do livro derivado do título, com sufixo `-2`, `-3`… se já existir.
- Livro novo: `type: "digital"`, `status: "Ler agora"`, `availability: "DIGITAL_DISPONIVEL"`,
  `chapters: 1`, `content: ""`, ano corrente, preço arredondado a centavos.
- Preço aceita vírgula (`19,90`); vazio é recusado.

### 1.11 Versionamento e compatibilidade

- Versão atual: **1** (`SCHEMA_VERSION` em `shared/catalog.js`).
- Mudança que só **adiciona** campo opcional: não precisa subir a versão (campos desconhecidos já são
  preservados), mas deve entrar nesta tabela e no validador.
- Mudança que **remove, renomeia ou muda tipo/obrigatoriedade**: subir `SCHEMA_VERSION`, escrever a
  migração v(n)→v(n+1) aplicada na leitura, atualizar este documento e registrar em DECISIONS.
- Cache do navegador: guardado como `{ version: 2, catalog, pendingSync, baseEtag, savedAt }` sob
  `fanverse:catalog:v2`. A chave antiga `fanverse-catalog-local` (catálogo cru) é migrada uma vez.

---

## 2. Domínio Java

Pacotes em `src/`. Tudo em memória; nenhuma classe lê ou grava o JSON.

```text
Livro ─┬─ LivroDigital (tamanhoArquivo MB > 0)      Colecao ── List<Livro>
       └─ LivroFisico  (quantidadePaginas > 0)         └─ ColecaoLivros (máx. 50)
Livro ◆── CodigoLivro (composição)                   Catalogo ── List<Livro> (máx. 50)
Usuario ──realizarEmprestimo──▶ Livro                Compra ── Usuario comprador, Livro livro
Biblioteca ── Usuario (um só) · registrarCompra → Compra
biblioteca.Compra (@Deprecated) extends compras.Compra
```

| Classe | Identificador | Regras verificadas por teste (`npm run test:java`) |
|---|---|---|
| `Livro` | `CodigoLivro` | título/autor não vazios (aparados), ano > 0 |
| `CodigoLivro` | `LIV-0001`, `LIV-0002`… | único na execução (sequência; antes aleatório e repetível) |
| `LivroDigital` / `LivroFisico` | herdado | tamanho > 0 / páginas > 0; valor inválido não altera o estado |
| `Colecao` | `COL-0001`… | único na execução; sem limite de livros |
| `ColecaoLivros` | herdado | recusa o 51º livro |
| `Catalogo` | — | recusa o 51º livro; busca por título (sem diferenciar maiúsculas), por código e por trecho; lista somente leitura |
| `Compra` | `idCompra` sequencial | comprador e livro obrigatórios, valor > 0, método vazio → "Não informado" |
| `Usuario` | `matricula` (texto) | nome e matrícula não vazios |
| `Biblioteca` | — | nome e cidade não vazios |

### Divergências Java × JSON (documentadas, não resolvidas)

| Conceito | JSON | Java |
|---|---|---|
| Identificador de livro | `id` slug escolhido | `CodigoLivro` gerado em memória |
| Tipo | `type: "digital" \| "fisico"` | subclasse `LivroDigital` / `LivroFisico` |
| Dados do tipo | nenhum | tamanho do arquivo / nº de páginas |
| Preço | `price` (≥ 0) | só em `Compra.valor` (> 0) |
| Arco | existe | não existe |
| Limite de 50 livros | não existe | `Catalogo` e `ColecaoLivros` |
| Usuário, compra, empréstimo | não existem | existem |

Qualquer sincronização futura precisa decidir: IDs, origem da verdade, conversão de tipos,
tratamento de preço zero e onde fica o limite de 50.
