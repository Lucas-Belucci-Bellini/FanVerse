# FanVerse — Registro de Decisões

Este arquivo registra decisões arquiteturais relevantes.

## DEC-001 — Documentar antes de evoluir

**Status:** Aceita  
**Data:** 2026-09-24

O projeto será documentado e mapeado antes de uma nova fase significativa de implementação.

**Motivo:** o repositório possui Java, Vite, Express, JSON e um site estático paralelo. Sem uma fotografia do estado atual, alterações podem criar duplicação ou quebrar partes existentes.

## DEC-002 — Não reescrever imediatamente

**Status:** Aceita  
**Data:** 2026-09-24

A primeira fase não será uma reescrita completa.

O objetivo inicial é entender, documentar, validar e separar o que é:
- ativo;
- legado;
- referência;
- acadêmico;
- candidato a evolução.

## DEC-003 — CLAUDE.md como regra operacional

**Status:** Aceita  
**Data:** 2026-09-24

As regras de trabalho para Claude Code ficam em `CLAUDE.md`.

O arquivo deve ser atualizado quando o processo de desenvolvimento mudar.

## DEC-004 — Mudanças grandes devem ser precedidas por planejamento

**Status:** Aceita  
**Data:** 2026-09-24

Mudanças arquiteturais relevantes devem ter:
- objetivo;
- impacto;
- riscos;
- critério de conclusão;
- documentação correspondente.

---

As decisões abaixo seguem o formato completo (contexto, problema, alternativas, decisão, consequências).
A evidência de cada problema está em `docs/AUDIT.md`.

## DEC-005 — Não versionar artefatos gerados

**Data:** 2026-09-25 · **Status:** Aceita e implementada

**Contexto:** `node_modules/` (834 arquivos), `dist/` e `out/` estavam no Git apesar do `.gitignore`.

**Problema:** o `node_modules/` versionado só tinha binários de Windows (`esbuild.exe`, rollup win32) e
sem bit de execução; `npm run build` falhava no Linux com `vite: Permission denied`. `dist/index.html`
apontava para bundles inexistentes e `out/` tinha um `.class` de uma classe que não existe mais.

**Alternativas:** (a) manter e regenerar a cada mudança; (b) Git LFS; (c) remover do índice e reconstruir
com `npm ci` / `npm run build` / `npm run java:build`.

**Decisão:** (c). Os arquivos saem do índice (`git rm --cached`), continuam no disco de quem já tem, e
o `.gitignore` cobre também locks de editor.

**Consequências:** clone novo precisa de `npm ci` (documentado). O histórico antigo continua pesado
(~9 MB em `.git`); reescrever histórico foi descartado por ser destrutivo e desnecessário agora.

## DEC-006 — Frontend Vite é o principal; `site/` fica congelado como referência

**Data:** 2026-09-25 · **Status:** Aceita

**Contexto:** duas interfaces web. O Vite tem o editor e fala com a API; o `site/` tem 7 páginas
(catálogo com filtros, coleção, livro, leitor, loja, autor) com dados próprios.

**Problema:** manter as duas evoluindo duplicaria dados, CSS e lógica — os dados já tinham divergido.

**Alternativas:** (a) promover o `site/` a principal; (b) fundir agora, portando tudo para o Vite;
(c) Vite principal, `site/` congelado e servido em `/site/`, com dados gerados a partir do JSON.

**Decisão:** (c). O Vite é o único integrado à API e ao contrato. O `site/` não recebe funcionalidade
nova; seus dados passam a ser **gerados** (`npm run sync:site-data`) e checados por teste. As páginas
dele são a referência de produto para a Fase 3 (portar leitor, loja, autor para o Vite).

**Consequências:** `npm start` serve o build do Vite em `/` e o `site/` em `/site/` (links antigos na
raiz redirecionam com 301). O `site/` só será removido depois de portado, com nova decisão.

## DEC-007 — API como fonte de verdade; `localStorage` só como cache e fila de pendências

**Data:** 2026-09-25 · **Status:** Aceita e implementada

**Contexto:** o frontend gravava o catálogo no `localStorage` e o lia **antes** da API.

**Problema:** atualizações do servidor nunca apareciam; o botão "Resetar" enviava o catálogo de exemplo
ao servidor e apagava o real; edições locais podiam se perder sem aviso.

**Alternativas:** (a) remover o `localStorage`; (b) manter prioridade local; (c) API primeiro, com o
navegador guardando cache e alterações ainda não enviadas, sempre visíveis ao usuário.

**Decisão:** (c). Ordem: pendências locais → API → cache → catálogo embutido no build. Pendências
nunca são descartadas em silêncio: aparece um aviso com "Enviar ao servidor" e "Descartar alterações
locais" (que nunca escreve no servidor). O envio usa `If-Match` com o ETag lido.

**Consequências:** nova chave `fanverse:catalog:v2`, com migração da antiga (vira pendência só se
diferir do servidor). Funciona sem API (hospedagem estática), com edição apenas local.

## DEC-008 — Proteção mínima da escrita do catálogo

**Data:** 2026-09-25 · **Status:** Aceita e implementada (provisória até existir autenticação real)

**Contexto:** `PUT /api/catalogo` gravava qualquer JSON, de qualquer origem.

**Problema:** qualquer um na rede podia apagar o catálogo ou injetar HTML (XSS armazenado).

**Alternativas:** (a) autenticação com usuários/sessões agora; (b) token de administrador por variável
de ambiente; (c) desativar a escrita.

**Decisão:** (b), com padrão seguro: sem `FANVERSE_ADMIN_TOKEN`, só requisições de loopback escrevem;
com o token, exige `Authorization: Bearer`. O servidor escuta em `127.0.0.1` salvo `HOST` explícito.
Todo payload é validado contra o contrato.

**Consequências:** fluxo local (dev + proxy do Vite) continua funcionando sem configurar nada. Em
produção, o editor do navegador não envia token — edições ficam locais até existir login (Fase 4).
Atrás de proxy reverso toda requisição parece loopback: **em produção o token é obrigatório**
(documentado em DEVELOPMENT.md).

## DEC-009 — Contrato do catálogo em módulo compartilhado, com versão de schema

**Data:** 2026-09-25 · **Status:** Aceita e implementada

**Contexto:** o formato do JSON só existia implicitamente; três cópias do código de "achatar" livros.

**Problema:** nada impedia IDs duplicados, preço inválido ou URL `javascript:`; cliente e servidor
podiam divergir nas regras.

**Alternativas:** (a) JSON Schema + biblioteca (ajv); (b) TypeScript; (c) validador próprio em JS puro
num módulo ESM usado pelos dois lados.

**Decisão:** (c) — `shared/catalog.js`, sem dependências, testado. Catálogos gravados levam
`schemaVersion: 1`; ausência é lida como v1; campos desconhecidos são preservados.

**Consequências:** mudar o formato exige subir `SCHEMA_VERSION`, escrever migração e atualizar
`DATA_MODEL.md`. O Java **não** segue esse contrato (modelo acadêmico independente); integrar os dois
continua sendo decisão futura.

## DEC-010 — Código Java separado da pasta do frontend (proposta)

**Data:** 2026-09-25 · **Status:** Proposta — não implementada

**Contexto:** `src/` mistura pacotes Java e o código do Vite (`main.js`, `app/`).

**Problema:** confunde responsabilidades e ferramentas (o Vite observa `src/`; o `javac` varre `src/`).

**Alternativas:** (a) manter; (b) mover Java para `java/src/main/java` (layout Maven/Gradle);
(c) mover o frontend para `web/`.

**Decisão proposta:** (b), num PR próprio, quando o dono confirmar — o README acadêmico e a faculdade
podem depender dos caminhos atuais. `scripts/java.mjs` concentra os caminhos para facilitar a mudança.

**Consequências esperadas:** atualizar `scripts/java.mjs`, README e docs; nenhum impacto na web.

## DEC-011 — Teste de ponta a ponta com playwright-core, sem baixar navegador

**Data:** 2026-09-26 · **Status:** Aceita e implementada

**Contexto:** os fluxos no navegador (adicionar livro, recarregar, modo sem API, XSS) eram verificados
à mão com Chromium headless; nada impedia uma regressão de voltar.

**Problema:** testes em Node cobrem a lógica, mas não a integração real entre HTML, eventos,
`localStorage`, `fetch` e o servidor.

**Alternativas:** (a) `@playwright/test` (runner próprio + download de ~150 MB de navegadores no
install/CI); (b) jsdom (não é navegador: sem layout, sem rede real); (c) `playwright-core` com o
`node:test` que o projeto já usa, dirigindo um Chrome/Chromium já instalado.

**Decisão:** (c). Uma única devDependency, sem script de instalação e sem download. No CI usa o Google
Chrome que vem no runner do GitHub (`FANVERSE_E2E_CHANNEL=chrome`); localmente, o Chrome instalado ou
`FANVERSE_E2E_BROWSER`. Capas externas são respondidas com uma imagem local para o teste não depender
de rede.

**Consequências:** `npm run test:e2e` exige um Chrome/Chromium na máquina; por isso fica fora do
`npm run verify` e roda no CI. Se o runner deixar de trazer o Chrome, basta instalar um no workflow.
