# FanVerse — Desenvolvimento

Todos os comandos abaixo foram executados em 2026-09-25 (Node 22, npm 10, JDK 21, Linux) antes de
serem documentados. Resultado registrado em `docs/STATUS.md`.

## Requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| Node.js | **20 ou mais novo** (CI usa 22) | web, testes, scripts |
| npm | o que vem com o Node | dependências |
| JDK | **17 ou mais novo** (CI usa 21), `javac` e `java` no PATH | domínio Java |

## Instalação

```bash
npm ci        # instala exatamente o package-lock.json (use `npm install` só para mudar dependências)
```

> `node_modules/`, `dist/` e `out/` **não** são versionados (DEC-005). Clone novo sempre começa por `npm ci`.

## Comandos oficiais

| Comando | O que faz |
|---|---|
| `npm run dev` | Frontend Vite em http://localhost:5173, repassando `/api` para o Express |
| `npm run dev:api` | Express em http://127.0.0.1:3000 com recarga automática (`node --watch`) |
| `npm run dev:lan` | Igual ao `dev`, mas acessível na rede (celular na mesma Wi-Fi) |
| `npm run build` | Gera `dist/` |
| `npm run preview` | Serve o `dist/` em http://localhost:4173 (também repassa `/api`) |
| `npm start` | Servidor de "produção": `dist/` em `/`, API em `/api`, site legado em `/site/` |
| `npm test` | Testes JS (`node --test`: contrato, API, frontend, dados do `site/`) |
| `npm run test:e2e` | Build + teste de ponta a ponta num navegador real (`e2e/app.e2e.js`) — precisa de Chrome/Chromium instalado |
| `npm run validate:data` | Confere `data/catalogo.json` contra o contrato |
| `npm run sync:site-data` | Regenera `site/assets/js/data.js` a partir do JSON |
| `npm run check:site-data` | Falha se `site/assets/js/data.js` estiver desatualizado |
| `npm run java:build` | Compila o Java em `out/` |
| `npm run java:run` | Compila e executa `principal.Principal` |
| `npm run test:java` | Compila `src` + `test/java` e roda `testes.DominioTest` |
| `npm run verify` | `npm test` + `npm run build` + `npm run test:java` — rode antes de abrir PR |

`npm run server` continua existindo como sinônimo de `npm start`. Não há lint configurado (AUDIT I-05).

## Fluxo de desenvolvimento web

Dois terminais:

```bash
npm run dev:api   # terminal 1 — API
npm run dev       # terminal 2 — abrir http://localhost:5173
```

Sem o `dev:api`, o frontend funciona com o catálogo embutido e avisa que o servidor está
indisponível; livros salvos ficam só no navegador.

Para não mexer no catálogo real enquanto testa, aponte a API para uma cópia:

```bash
cp data/catalogo.json /tmp/catalogo-teste.json
FANVERSE_DATA_PATH=/tmp/catalogo-teste.json npm run dev:api
```

(PowerShell: `$env:FANVERSE_DATA_PATH="C:\temp\catalogo-teste.json"; npm run dev:api`)

## Variáveis de ambiente do servidor

| Variável | Padrão | Efeito |
|---|---|---|
| `PORT` | `3000` | porta HTTP |
| `HOST` | `127.0.0.1` | interface. Use `0.0.0.0` para aceitar conexões externas |
| `FANVERSE_DATA_PATH` | `data/catalogo.json` | arquivo do catálogo |
| `FANVERSE_ADMIN_TOKEN` | (vazio) | se definido, `PUT /api/catalogo` exige `Authorization: Bearer <token>`; se vazio, só a própria máquina grava |
| `FANVERSE_API_URL` | `http://localhost:3000` | (Vite) para onde `npm run dev`/`preview` repassam `/api` |

⚠️ **Produção:** ao usar `HOST=0.0.0.0` ou um proxy reverso, **defina `FANVERSE_ADMIN_TOKEN`**. Atrás
de proxy toda requisição chega como loopback e a proteção padrão deixa de valer (DEC-008).
Nunca versione o token.

## Editando o catálogo

1. Pelo editor do site (`#editor`) com a API rodando; ou
2. editando `data/catalogo.json` à mão e depois:

```bash
npm run validate:data
npm run sync:site-data   # o site legado lê uma cópia gerada
```

O teste `test/site-data.test.js` falha se o passo 2 for esquecido.

## Java

```bash
npm run java:run    # compila e executa o exemplo
npm run test:java   # testes do domínio
```

Feito para funcionar igual no Windows: usa só Node, sem `find` nem PowerShell (verificado em Linux; ainda não executado no Windows). Equivalente manual, se preferir:

```bash
# Linux/macOS
javac -encoding UTF-8 -d out $(find src -name "*.java")
java -Dstdout.encoding=UTF-8 -cp out principal.Principal
```

```powershell
# Windows PowerShell (não executado nesta rodada — o ambiente de verificação é Linux)
javac -encoding UTF-8 -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
java "-Dstdout.encoding=UTF-8" -cp out principal.Principal
```

## Testes

- **Onde:** `test/*.test.js` (Node, sem dependências) e `test/java/testes/DominioTest.java`.
- **Princípio:** cada teste verifica comportamento real e, quando nasceu de um bug, o nome diz qual
  (ex.: "descartar alterações locais NUNCA escreve no servidor").
- A API é testada de ponta a ponta numa porta efêmera com uma cópia temporária do catálogo — o
  `data/catalogo.json` real nunca é tocado.
- **Ponta a ponta** (`npm run test:e2e`): sobe o servidor real servindo o `dist/` e usa um navegador
  de verdade (playwright-core) para abrir o catálogo, adicionar livro, recarregar, validar o formulário,
  testar 375 px e o modo sem API. Não baixa navegador: usa o Google Chrome instalado
  (`FANVERSE_E2E_CHANNEL`, padrão `chrome`) ou o executável em `FANVERSE_E2E_BROWSER`:

  ```bash
  FANVERSE_E2E_BROWSER=/caminho/para/chromium npm run test:e2e
  ```

## Integração contínua

`.github/workflows/ci.yml` roda em push para `main` e em todo PR:

- **web:** `npm ci` → `validate:data` → `npm test` → `test:e2e` (build + navegador, com o Chrome do runner);
- **java:** `test:java` → `java:run`.

## Deploy (Vercel)

O repositório está ligado ao projeto `fan-verse` no Vercel, que roda `npm run build` e publica o
`dist/` como site **estático**: cada push gera um preview, e o `main` vai para produção.

- Não há API no Vercel. O frontend mostra o catálogo embutido no build (`data/catalogo.json` no
  momento do build) e avisa que o servidor está indisponível; edições ficam só no navegador.
- Para publicar uma mudança de catálogo no Vercel: edite `data/catalogo.json`, valide e faça push.
- Até a remoção do `node_modules/` versionado (DEC-005), todo build no Vercel falhava com
  `vite: Permission denied`.

## Validação mínima antes de um PR

```bash
npm run verify
```

Mudou UI? Abra no navegador com `dev` + `dev:api` e confira o console. Mudou o formato do catálogo?
Atualize `docs/DATA_MODEL.md` e `shared/catalog.js` juntos (DEC-009).

## Princípio

Não afirmar que algo funciona só porque o código parece correto. Executar a verificação
correspondente e registrar o resultado real.
