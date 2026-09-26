# FanVerse — Auditoria técnica

**Data:** 2026-09-25 · **Base auditada:** `main` @ `8eacb09` + baseline de documentação (`docs/project-baseline` @ `63a4e3f`)
**Método:** leitura de todo o código e documentação, e **execução** de cada verificação citada
(build, servidor, requisições com `curl`, compilação e execução do Java, navegador headless).
Um achado só entra aqui com evidência reproduzida; quando algo é inferência, está dito.

Legenda de status: ✅ corrigido nesta rodada · 🟡 mitigado/parcial · ⏳ registrado no roadmap · ℹ️ só informativo.

---

## 1. Resumo executivo

O FanVerse tinha **quatro partes que não conversavam de forma confiável**: um frontend Vite, uma
API Express, um site estático em `site/` e um domínio Java acadêmico. Os problemas mais graves não
eram de arquitetura, e sim de **segurança e integridade de dados**:

| # | Achado | Severidade | Status |
|---|---|---|---|
| S-01 | Leitura de **qualquer arquivo do disco** via `GET /../../../../etc/hostname` | Crítica | ✅ |
| D-01 | Botão **"Resetar"** sobrescrevia o catálogo real do servidor (4 livros → 2) | Crítica | ✅ |
| S-02 | `PUT /api/catalogo` aceitava qualquer JSON, **sem autenticação** | Alta | ✅ |
| S-03 | XSS armazenado: todo campo do catálogo ia para `innerHTML` sem escape | Alta | ✅ |
| I-01 | `node_modules/` versionado (só binários Windows) **quebrava o build no Linux — e todo deploy de produção no Vercel** | Alta | ✅ |
| D-02 | Frontend preso ao `localStorage`: nunca via atualizações do servidor | Alta | ✅ |
| D-03 | Em dev e no build publicado o frontend **nunca lia a API nem o JSON** | Alta | ✅ |

Depois da rodada: 69 testes automatizados (57 JS + 12 Java), CI no GitHub Actions, validação do
contrato do catálogo no servidor e no cliente, e documentação alinhada ao código.

---

## 2. Estrutura do repositório

### 2.1 Mapa (estado encontrado)

| Caminho | Responsabilidade | Situação encontrada |
|---|---|---|
| `index.html`, `src/main.js`, `src/style.css` | Frontend Vite (landing + catálogo + editor) | Ativo |
| `server.js` | API Express + servidor de arquivos | Ativo, servia `site/` (não o Vite) |
| `data/catalogo.json` | Catálogo (autor → coleções → arcos → livros) | Ativo, sem contrato formal |
| `site/*.html`, `site/assets/` | Site estático com 7 páginas (catálogo, livro, leitor, loja…) | Legado/protótipo, dados próprios |
| `src/**/*.java` | Domínio acadêmico (livros, usuário, catálogo, compra) | Ativo como exercício; **sem integração** com a web |
| `livros md/README.md` | Pasta reservada para textos em Markdown | Só README, nome com espaço |
| `node_modules/` (834 arquivos) | Dependências | **Versionado** (I-01) |
| `dist/index.html` | Build | **Versionado e quebrado** (referenciava bundles ausentes) |
| `out/*.class` (13) | Java compilado | **Versionado**, com `.class` obsoleto (`Livro$CodigoLivro`) |
| `src/*/.LCKCompra.java~` | Lock de editor com caminho `C:\Users\...` | Lixo versionado |
| `docs/` | Baseline + documentação por arquivo | Parcialmente divergente do código |

### 2.2 Integrações reais (verificadas)

```text
Frontend Vite ──GET/PUT /api/catalogo──▶ Express ──▶ data/catalogo.json
      │   (em dev não chegava: sem proxy)       │
      └── localStorage (tinha prioridade)       └── servia site/ em "/"
site/ ──▶ site/assets/js/data.js (cópia manual do JSON)
Java  ──▶ nada (apenas System.out; não lê nem grava o JSON)
```

- Das 5 rotas da API, **o frontend só usa `GET` e `PUT /api/catalogo`**. `books`, `book/:id` e
  `collection/:id` não têm consumidor no repositório (mantidas: são contrato público documentado).
- O `site/` **não usa a API**: lê `data.js`. O Java **não usa** nem o JSON nem a API.

### 2.3 Duplicações encontradas

| Duplicação | Cópias | Status |
|---|---|---|
| Catálogo | `data/catalogo.json`, `site/assets/js/data.js` (já divergente), `FALLBACK_CATALOG` em `main.js` (só 2 livros) | ✅ JSON único; `data.js` gerado; fallback = JSON embutido no build |
| "Achatar" livros | `server.js` (2×), `main.js`, `site/data.js` | ✅ `shared/catalog.js#flattenBooks` (o `site/` legado mantém a sua, gerada) |
| Tokens/CSS | `src/style.css` e `site/assets/css/style.css` com variáveis quase iguais | ⏳ some quando o `site/` for aposentado (DEC-006) |
| `Compra` Java | `compras.Compra` e `biblioteca.Compra` (`@Deprecated`, subclasse) | ℹ️ mantida por compatibilidade, coberta por teste |
| Limite de 50 | `Catalogo` e `ColecaoLivros` | ℹ️ regra só do Java; o JSON não tem limite (ver DATA_MODEL) |

---

## 3. Segurança

| ID | Achado e evidência | Status / correção |
|---|---|---|
| **S-01** | `app.get('*')` montava `path.join(ROOT,'site',req.path)`. `express.static` recusa `..` com 403 mas, com `fallthrough`, passa adiante; o curinga servia o arquivo. `curl --path-as-is /../../../../etc/hostname` → **200** com o conteúdo; `/../server.js` → código-fonte. | ✅ Curinga removido; só `express.static` com raiz confinada. Teste com requisições cruas (`test/server.test.js`). |
| **S-02** | `PUT /api/catalogo` sem autenticação e validando só `Array.isArray(collections)`. `{"collections":[{"x":1}]}` foi gravado e `/api/catalogo/books` passou a responder 500. | ✅ Validação completa do contrato (400 + detalhes, arquivo intacto). Escrita exige `FANVERSE_ADMIN_TOKEN` quando configurado; sem token, só loopback. Servidor escuta em `127.0.0.1` por padrão. (DEC-008) |
| **S-03** | `main.js` e `site/app.js` interpolavam título, descrição, capa etc. em `innerHTML`. Com S-02, qualquer pessoa podia gravar `<img onerror>`. | ✅ no frontend principal (escape + URL de capa validada; teste de XSS). 🟡 `site/` legado: dados agora vêm só do JSON versionado e validado; o escape não foi portado (congelado, DEC-006). |
| **S-04** | `/src` servido estaticamente: `GET /src/livros/Livro.java` → 200. | ✅ Removido. |
| **S-05** | JSON malformado respondia página HTML com stack trace e caminho absoluto (`/home/user/FanVerse/node_modules/...`). | ✅ Handler de erro único; resposta JSON sem detalhes internos. |
| **S-06** | `npm audit`: `qs` (DoS, via express) e `esbuild ≤0.24.2` (via Vite 5: sites maliciosos leem respostas do **servidor de dev**). O dev server era exposto em `0.0.0.0` por padrão. | ✅ `qs`/express atualizados. 🟡 esbuild: exige Vite 6+ (major); mitigado com dev em `localhost` por padrão (`dev:lan` para expor). ⏳ upgrade do Vite. |
| S-07 | Segredos/credenciais no código | ℹ️ Nenhum encontrado (varredura por `token`, `secret`, `password`, `key`, `.env`). |

---

## 4. Dados

| ID | Achado | Status |
|---|---|---|
| **D-01** | "Resetar" chamava `persistCatalog(FALLBACK_CATALOG)`, que faz `PUT` — o servidor ficava com os 2 livros de exemplo. | ✅ Virou "Descartar alterações locais": limpa só o navegador e recarrega; teste garante que não há `PUT`. |
| **D-02** | `loadCatalog()` retornava a cópia do `localStorage` antes de consultar a API — para sempre. | ✅ API é a fonte de verdade; edições locais não sincronizadas ficam como "pendentes" com ações explícitas (DEC-007). |
| **D-03** | Em `npm run dev`, `/api/catalogo` respondia `index.html` (200) do Vite; no build publicado, `/data/catalogo.json` também. O frontend caía no fallback de 2 livros. | ✅ Proxy `/api` no Vite; o build embute o JSON. Verificado no Chromium. |
| **D-04** | `site/assets/js/data.js` divergia do JSON (`"Aventura começou"` × `"A aventura começou"`). | ✅ Gerado por script; teste falha se desatualizado. |
| **D-05** | Sem contrato: tipos, obrigatoriedade e unicidade de IDs não eram verificados; `book/:id` supõe IDs únicos. | ✅ Contrato v1 em `shared/catalog.js` + `docs/DATA_MODEL.md`; `schemaVersion` gravado. |
| **D-06** | Escrita não atômica (`writeFileSync` direto) e sem controle de concorrência. | ✅ tmp + rename, fila de escrita, `ETag`/`If-Match` (412). |
| **D-07** | IDs gerados com `Date.now()` (`novo-1727…`, `colecao-…`). | ✅ IDs derivados do título, com sufixo quando repetem. |
| D-08 | Modelo Java ≠ modelo JSON (Java não tem arco, preço, capa; JSON não tem usuário/compra). | ℹ️ Documentado; nenhuma sincronização existe nem foi criada (DEC-009). |
| D-09 | Campos `status` ("Ler agora") e `availability` ("DIGITAL_DISPONIVEL") são texto livre com papéis sobrepostos. | ⏳ Aceitos como texto no v1; normalização é mudança de schema (Fase 2). |

---

## 5. Frontend (Vite)

| Aspecto | Encontrado | Status |
|---|---|---|
| Entrada/renderização | `main.js` único de 416 linhas: dados, HTML, persistência e eventos misturados | ✅ Separado em `shared/`, `src/app/catalog-store.js`, `src/app/views.js`, `src/main.js` |
| Estado | Objeto mutado em vários lugares; eventos re-registrados a cada render | ✅ Estado único + delegação de eventos (registrados uma vez) |
| Erros/feedback | `alert()`; falha de API só no console | ✅ Mensagens `aria-live`, erros por campo, aviso de origem dos dados |
| Estados de UI | Sem loading nem estado vazio | ✅ Carregando, vazio, offline/cache, pendente |
| Acessibilidade | Menu some em < 900px; sem foco visível; `alt` genérico | ✅ Menu visível no mobile, `:focus-visible`, `alt` descritivo, `aria-invalid` |
| Responsividade | Layout ok em 375px, sem rolagem horizontal (verificado) | ℹ️ |
| Validação do formulário | Preço vazio virava R$ 0,00 | ✅ Recusado (teste) |
| Navegação | Âncoras na mesma página; leitor/loja/autor só existem no `site/` | ⏳ Portar páginas do `site/` (Fase 3) |

## 6. Backend (Express)

| Aspecto | Encontrado | Status |
|---|---|---|
| Inicialização | `app.listen` no mesmo arquivo das rotas — impossível testar | ✅ `server/app.js#createApp` + `server.js` só faz `listen` |
| O que é servido | `site/` em `/`, `/assets` e `/src`; o build do Vite **não era servido** | ✅ `dist/` em `/`, `site/` em `/site/` (links antigos com 301) |
| Erros | `book/:id` e `collection/:id` sem `try/catch`; formatos diferentes | ✅ Formato único `{ error, message, details? }` |
| Rotas `/api` inexistentes | Caíam no `index.html` | ✅ 404 JSON |
| Leitura | `readFileSync` síncrono a cada requisição | 🟡 Agora assíncrono; ainda relê o arquivo a cada GET (ok para o volume atual) |

## 7. Java

| ID | Achado | Status |
|---|---|---|
| J-01 | `CodigoLivro`/`Colecao` com número aleatório 1000–9999: códigos repetem (teste reproduziu duplicata) | ✅ Sequência `AtomicInteger` |
| J-02 | `Compra.contador` `static int` não thread-safe | ✅ `AtomicInteger` |
| J-03 | `Catalogo.listarLivrosPorColecao(null)` → `NullPointerException`; filtra por trecho do título (heurística) | ✅ Valida entrada · ℹ️ heurística mantida e documentada |
| J-04 | `javac -Xlint:all`: 7 avisos `this-escape` (setters chamados no construtor) | ℹ️ Padrão didático intencional; suprimido só esse aviso no script, demais com `-Werror` |
| J-05 | `biblioteca.Compra` depreciada, sem uso | ℹ️ Mantida (compatibilidade), coberta por teste |
| J-06 | Valor monetário em `double`; data como `String`; status texto livre | ⏳ Registrado (Fase 2 se o Java evoluir) |
| J-07 | `Biblioteca` guarda um único `Usuario`; empréstimo só imprime | ℹ️ Escopo acadêmico |
| J-08 | Código Java dentro de `src/`, pasta que o Vite também usa | ⏳ Proposta de mover para `java/` (DEC-010) |
| J-09 | Comando documentado `javac -d out $(find …)` escrevia em pasta versionada; acentos saíam `?` | ✅ `npm run java:run` portátil, UTF-8, `out/` ignorado |

## 8. Qualidade, ferramentas e processo

| ID | Achado | Status |
|---|---|---|
| I-01 | `node_modules/` versionado com binários Windows → `sh: vite: Permission denied` no Linux. **Mesmo erro no Vercel:** os deploys de produção do `main` (`8b26c70`, `dc9a6a8`, `8eacb09`) terminaram em ERROR com `node_modules/.bin/vite: Permission denied` e o projeto `fan-verse` não tem nenhum deploy de produção READY. | ✅ Removido do Git (DEC-005). Os previews da branch ficam READY desde `1b5fa06` e servem o mesmo build testado localmente. |
| I-02 | `dist/` e `out/` versionados e desatualizados | ✅ Removidos; `.gitignore` ampliado |
| I-03 | Nenhum teste | ✅ 57 testes JS (`node --test`, sem dependência nova) + 12 Java |
| I-04 | Nenhum CI | ✅ `.github/workflows/ci.yml` |
| I-05 | Sem lint/formatter | ⏳ Avaliar ESLint (Fase 2) — não adicionado para não criar dependência sem regra acordada |
| I-06 | TODO/FIXME no código | ℹ️ Nenhum encontrado |
| I-07 | Texto de marketing técnico na UI ("Vite pronto para Vercel") | ✅ Trocado por métrica real (arcos) |
| I-08 | Pasta `livros md/` com espaço no nome e sem conteúdo | ⏳ Decidir uso (Fase 3); não mexida |

---

## 9. Ativo × legado (conclusão)

| Parte | Classificação | Base da conclusão |
|---|---|---|
| Frontend Vite | **Principal** | Único integrado à API e aos dados; tem o editor |
| API Express | **Ativa** | Única persistência real |
| `data/catalogo.json` | **Fonte de verdade** | Todos os outros dados derivam dele agora |
| `site/` | **Legado congelado / referência de produto** | Tem páginas que o Vite não tem (leitor, loja, autor), mas dados próprios e nenhuma integração |
| Java | **Acadêmico, ativo como exercício** | Compila, roda, testado; não é backend da web |
| `livros md/` | **Reservado** | Só README |

Detalhes e consequências em `docs/DECISIONS.md` (DEC-005 a DEC-010).
