# FanVerse — Arquitetura

## 1. Visão geral (estado atual, verificado)

```text
                    ┌──────────────── navegador ────────────────┐
                    │  Frontend Vite (principal)   site/ legado │
                    │  index.html → src/main.js    7 páginas    │
                    │   ├─ src/app/views.js        data.js      │
                    │   └─ src/app/catalog-store   (gerado)     │
                    │        │  localStorage (cache/pendências) │
                    └────────┼──────────────────────────────────┘
                   GET/PUT /api/catalogo      GET /site/*
                             ▼                     ▼
                    ┌──────── Express (server.js → server/app.js) ────────┐
                    │  API /api/*  ·  dist/ em "/"  ·  site/ em "/site/"   │
                    │        └─ server/catalog-repository.js               │
                    └─────────────────────┬────────────────────────────────┘
                                          ▼
                                 data/catalogo.json  ◀── fonte de verdade
                                          │
                     scripts/sync-site-data.mjs ──▶ site/assets/js/data.js

     shared/catalog.js ── contrato: validação, consultas, caso de uso "addBook"
                          (importado pelo servidor, pelo frontend e pelos testes)

     Domínio Java (src/**/*.java) ── independente, só em memória, sem ligação com a web
```

## 2. Camadas

A separação abaixo existe para resolver problemas concretos (regras duplicadas entre cliente e
servidor, código impossível de testar), não por padrão estético.

| Camada | Web | Java |
|---|---|---|
| **Apresentação** | `src/app/views.js` (HTML com escape), `src/style.css`, `index.html` | `Principal` (saída no console) |
| **Aplicação / casos de uso** | `src/main.js` (estado e eventos), `src/app/catalog-store.js` (carregar/salvar/descartar), `server/app.js` (rotas, autorização) | `Biblioteca.registrarCompra`, `registrarEmprestimo` |
| **Domínio** | `shared/catalog.js` (contrato, `validateCatalog`, `addBook`, `flattenBooks`) | `livros`, `colecoes`, `catalogo`, `compras`, `usuarios` |
| **Persistência / infraestrutura** | `server/catalog-repository.js` (arquivo JSON, atômico, ETag), `localStorage`, `server/errors.js` | nenhuma (memória) |

**Regra de dependência:** `shared/` não importa nada de `server/` nem de `src/`, não usa DOM nem
APIs do Node — é o que permite rodar a mesma regra no navegador, no Express e no `node --test`.

## 3. Módulos

| Arquivo | Responsabilidade | Testes |
|---|---|---|
| `shared/catalog.js` | Contrato v1 do catálogo; `validateCatalog`, `addBook`, `flattenBooks`, `findBook`, `findCollection`, `slugify`, `uniqueId`, `isSafeUrl` | `test/catalog.test.js` |
| `server/app.js` | `createApp(options)`: rotas da API, autorização da escrita, estáticos | `test/server.test.js` |
| `server/catalog-repository.js` | Ler/gravar o JSON: gravação atômica, fila, ETag/If-Match | `test/server.test.js` |
| `server/errors.js` | `HttpError`, handler de erro único | `test/server.test.js` |
| `server.js` | Lê variáveis de ambiente e faz `listen` | manual (`npm start`) |
| `src/app/catalog-store.js` | Origem dos dados no navegador (API → cache → embutido), pendências, migração da chave antiga | `test/frontend.test.js` |
| `src/app/views.js` | Renderização em string, escape, estados de UI | `test/frontend.test.js` |
| `src/main.js` | Bootstrap, estado da tela, eventos (delegados) | Chromium (manual; ver STATUS) |
| `scripts/sync-site-data.mjs` | Gera `site/assets/js/data.js` | `test/site-data.test.js` |
| `scripts/validate-data.mjs` | Valida `data/catalogo.json` | CI |
| `scripts/java.mjs` | Compila/executa/testa o Java em qualquer SO | CI |
| `test/java/testes/DominioTest.java` | Regras do domínio Java | `npm run test:java` |

## 4. Fluxos principais

**Abrir o frontend:** `catalog-store.load()` → pendências locais? mostra-as com aviso → senão
`GET /api/catalogo` (JSON válido) → senão cache → senão catálogo embutido no build.

**Salvar um livro:** `addBook()` valida e devolve catálogo novo → grava pendência local →
`PUT /api/catalogo` com `If-Match` → 200 limpa a pendência · 412/401/403/rede mantêm a pendência e
avisam.

**Descartar alterações locais:** apaga o cache do navegador e recarrega. **Nunca escreve no servidor.**

**PUT no servidor:** autorização → `validateCatalog` → fila → confere `If-Match` → grava temporário →
`rename` → responde com novo ETag.

## 5. Onde cada coisa roda

| Comando | O que sobe | Observação |
|---|---|---|
| `npm run dev` + `npm run dev:api` | Vite 5173 com proxy `/api` → Express 3000 | fluxo de desenvolvimento |
| `npm run build && npm start` | Express 3000 serve `dist/` + API + `site/` | "produção" local, uma origem só |
| hospedagem estática do `dist/` | só o frontend | sem API: mostra o catálogo embutido; edições ficam locais |

## 6. Limites atuais (o que **não** assumir)

- Java **não** é backend da web; nenhum código converte entre os dois modelos.
- JSON em arquivo **não** é banco: um processo, sem histórico de versões, sem busca indexada.
- Não há usuários, login, compras ou pagamento reais na web.
- O token de administrador é proteção mínima, não autenticação (DEC-008).
- `site/` está congelado (DEC-006): não recebe correções além da geração de dados.

## 7. Arquitetura alvo (evolutiva)

Cada passo só acontece quando o anterior mostrar necessidade; nenhum é obrigatório agora.

1. **Consolidar a web (Fase 2–3):** portar leitor, página de livro, coleção, loja e autor do `site/`
   para o Vite, sobre `shared/catalog.js`; então aposentar o `site/` (nova decisão). Navegação por
   hash (`#/livro/:id`) basta — sem framework enquanto o JS puro der conta.
2. **Separar Java de `src/` (DEC-010)** quando o dono confirmar.
3. **Persistência (Fase 4, se o volume/uso pedir):** trocar `catalog-repository.js` por um repositório
   com a mesma interface (`read`, `write`) sobre SQLite/PostgreSQL. As rotas e o frontend não mudam.
4. **Autenticação (Fase 4):** substituir o token por sessões; só então criar `/api/users`,
   `/api/library`, `/api/purchases`.
5. **Java × web:** se o Java virar backend, a fronteira natural é o contrato de `shared/catalog.js`
   (o Java passaria a ler/gravar esse JSON), decidido em ADR próprio.
