# FanVerse — API

Implementação: `server/app.js` (rotas), `server/catalog-repository.js` (arquivo JSON),
`server/errors.js` (formato de erro). Entrada: `server.js`. Testes: `test/server.test.js`.

- **Base:** `http://127.0.0.1:3000/api` (porta `PORT`, interface `HOST`).
- **Formato:** JSON UTF-8. Sem versionamento de URL; o formato do catálogo carrega `schemaVersion`.
- **Consumidores no repositório:** o frontend Vite usa só `GET` e `PUT /api/catalogo`. As rotas de
  consulta (`books`, `book/:id`, `collection/:id`) não têm consumidor interno, mas são contrato público.

## Formato de erro

Toda resposta de erro da API:

```json
{ "error": "VALIDATION_ERROR", "message": "texto para humanos", "details": [{ "path": "collections[0].id", "message": "…" }] }
```

`details` só aparece em `VALIDATION_ERROR`. `message` existia no formato antigo (`{ message }`) e foi
mantido. Stack trace e caminhos de arquivo nunca vão para o cliente — só para o log do servidor.

| HTTP | `error` | Quando |
|---|---|---|
| 400 | `INVALID_JSON` | corpo não é JSON válido |
| 400 | `VALIDATION_ERROR` | catálogo fora do contrato (`docs/DATA_MODEL.md`) |
| 401 | `UNAUTHORIZED` | token configurado e `Authorization` ausente/errado |
| 403 | `FORBIDDEN` | sem token configurado e requisição de fora da máquina |
| 404 | `NOT_FOUND` | livro/coleção inexistente ou rota `/api/...` desconhecida |
| 412 | `PRECONDITION_FAILED` | `If-Match` não bate com a versão atual (edição concorrente) |
| 413 | `PAYLOAD_TOO_LARGE` | corpo > 2 MB |
| 500 | `PERSISTENCE_ERROR` | arquivo do catálogo ilegível, corrompido ou não gravável |
| 500 | `INTERNAL_ERROR` | erro inesperado |

---

## `GET /api/health`

Verifica se o servidor está no ar. Não lê o catálogo.

**200** → `{ "status": "ok" }`

## `GET /api/catalogo`

Catálogo completo, exatamente como está em `data/catalogo.json`.

- **Cabeçalhos da resposta:** `ETag: "<hash>"` (versão do arquivo), `Cache-Control: no-store`.
- **200** → objeto `Catalog`. **500** `PERSISTENCE_ERROR`.
- **Frontend:** carregado na abertura; o `ETag` é guardado para o próximo `PUT`.

```bash
curl -i http://127.0.0.1:3000/api/catalogo
```

## `PUT /api/catalogo`

Substitui o catálogo inteiro.

- **Autorização (DEC-008):** com `FANVERSE_ADMIN_TOKEN` definido, exige
  `Authorization: Bearer <token>`. Sem ele, só aceita requisições de loopback (127.0.0.1/::1).
- **Cabeçalhos:** `Content-Type: application/json` (obrigatório); `If-Match: <ETag>` (opcional,
  recomendado — sem ele a gravação sobrescreve sem checar concorrência).
- **Corpo:** `Catalog` válido (ver DATA_MODEL). Limite 2 MB.
- **Validação:** contrato completo — tipos, obrigatórios, IDs únicos, preço ≥ 0, URLs seguras.
  Nada é gravado se houver qualquer erro.
- **Gravação:** atômica (arquivo temporário + rename) e serializada; `schemaVersion: 1` é inserido.
- **200** → `{ "message": "Catálogo atualizado com sucesso.", "catalog": { … } }` + novo `ETag`.
- **Erros:** 400, 401, 403, 412, 413, 500.
- **Frontend:** chamado ao salvar um livro e em "Enviar ao servidor". 412/401/403/rede fazem a
  alteração ficar pendente no navegador, com aviso.

```bash
curl -X PUT http://127.0.0.1:3000/api/catalogo \
  -H 'Content-Type: application/json' \
  -H "If-Match: $(curl -sI http://127.0.0.1:3000/api/catalogo | awk -F': ' 'tolower($1)=="etag"{print $2}' | tr -d '\r')" \
  --data @data/catalogo.json
```

## `GET /api/catalogo/books`

Todos os livros numa lista plana, cada um com `collectionId`, `collectionTitle`, `arcId`, `arcTitle`.

**200** → `Book[]` (achatado). **500** `PERSISTENCE_ERROR`.

## `GET /api/catalogo/book/:id`

Um livro pelo `id` (único no catálogo), no formato achatado.

**200** → `Book`. **404** `NOT_FOUND` (`"Livro não encontrado."`).

```bash
curl http://127.0.0.1:3000/api/catalogo/book/sol-01
```

## `GET /api/catalogo/collection/:id`

Uma coleção pelo `id`, com seus arcos e livros aninhados.

**200** → `Collection`. **404** `NOT_FOUND` (`"Coleção não encontrada."`).

---

## Arquivos estáticos servidos pelo mesmo processo

| Caminho | Conteúdo |
|---|---|
| `/` | build do Vite (`dist/`). Sem build: redireciona 302 para `/site/` |
| `/site/…` | site estático legado |
| `/<página>.html` (ex.: `/livro.html?id=x`) | 301 para `/site/<página>.html` — compatibilidade com links antigos |
| qualquer outro | 404 texto |

Caminhos com `..` nunca saem das pastas públicas (AUDIT S-01). `/src` não é mais servido.

## Mudanças em relação à API anterior

| Antes | Agora |
|---|---|
| `PUT` aceitava qualquer objeto com `collections` array | valida o contrato inteiro |
| `PUT` aberto a qualquer origem | token ou só loopback |
| erro de JSON devolvia HTML com stack trace | JSON `INVALID_JSON` |
| erro `{ message }` | `{ error, message, details? }` (`message` mantido) |
| rota `/api/...` inexistente → `index.html` do `site/` | 404 JSON |
| `/` servia `site/`; `/src` exposto | `/` serve `dist/`; `site/` em `/site/`; `/src` removido |
| sem `ETag`/concorrência | `ETag` + `If-Match` → 412 |
| novo: — | `GET /api/health` |

## Rotas futuras (não implementadas)

`/api/users`, `/api/library`, `/api/purchases` dependem de autenticação e de persistência além de um
arquivo JSON (Fase 4 do roadmap). Não serão criadas antes disso para não expor contratos sem dono.
