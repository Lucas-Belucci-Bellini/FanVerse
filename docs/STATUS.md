# FanVerse — Estado Atual

**Atualizado em:** 2026-09-25 · **Branch:** `claude/loving-allen-5csmuk`
**Fase:** 0 (baseline) concluída · 1 (estabilização) concluída · 2 (fundação) em andamento

## Resumo

O FanVerse é um projeto híbrido: domínio acadêmico em Java + aplicação web (Vite, JavaScript puro,
Express, catálogo JSON) + um site estático legado em `site/`. Nesta rodada foi feita a auditoria
completa (`docs/AUDIT.md`) e corrigidos os problemas que impediam funcionamento ou punham dados e
segurança em risco. A web agora tem **uma fonte de verdade** (`data/catalogo.json`), um contrato
validado dos dois lados e testes.

## Componentes

| Componente | Estado | Observação |
|---|---|---|
| Frontend Vite | ✅ Principal (DEC-006) | catálogo + editor; escape de HTML; estados de carregando/vazio/offline |
| API Express | ✅ Ativa | contrato validado, erros padronizados, escrita protegida, ETag |
| Catálogo JSON | ✅ Fonte de verdade | contrato v1 com `schemaVersion` |
| Site `site/` | 🧊 Congelado | servido em `/site/`; dados gerados do JSON |
| Domínio Java | ✅ Acadêmico | compila, roda, 12 testes; sem integração com a web |
| Testes | ✅ 57 JS + 12 Java | `npm test`, `npm run test:java` |
| CI | ✅ GitHub Actions | web + java |
| Autenticação | ⚠️ Mínima | token de administrador (DEC-008), sem usuários |
| Banco de dados | — | não necessário ainda |
| Pagamento | — | compras só existem no Java, como modelo |
| Artefatos versionados | ✅ Removidos | `node_modules/`, `dist/`, `out/` (DEC-005) |

## Verificações realizadas (resultados reais, 2026-09-25)

| Verificação | Resultado |
|---|---|
| `npm ci` (Linux) | ok · antes: `vite: Permission denied` com o `node_modules/` versionado |
| `npm test` | 57/57 passam |
| `npm run build` | ok (`dist/` ~23 kB JS, ~6 kB CSS) |
| `npm run test:java` | 12/12 · o teste de unicidade **falha** no código antigo (código repetido) e passa no novo |
| `npm run java:run` | ok, acentos corretos |
| `npm run validate:data` / `check:site-data` | ok |
| `npm run verify` | exit 0 |
| Ataque de travessia (`curl --path-as-is /../../../../etc/hostname`) | antes 200 com o arquivo · agora 404 |
| `PUT` sem token (com token configurado) / com token / `If-Match` velho | 401 / 200 / 412 |
| Chromium — dev (`dev` + `dev:api`) | 4 livros; adicionar livro grava no arquivo (com `schemaVersion`), persiste após recarregar; `<b>` no título aparece como texto; erros por campo e foco no 1º inválido |
| Chromium — `npm run build && npm start` | build servido com dados da API |
| Chromium — build estático sem API | catálogo embutido (4 livros; antes caía em 2) + aviso; edição fica pendente e sobrevive ao recarregar |
| Chromium — 375 px | menu visível, sem rolagem horizontal |
| Chromium — 7 páginas do `site/` em `/site/` | todas renderizam, sem erro de JS |
| `npm audit` | 0 vulnerabilidades (após Vite 5 → 6.4.3; antes: 2 avisos do esbuild via Vite 5) |
| Chromium com Vite 6 | dev + API, preview + API e build estático sem API: mesmos resultados do Vite 5 |
| Vercel (projeto `fan-verse`) | produção do `main`: **nenhum deploy READY** — todos em ERROR por `vite: Permission denied` (o `node_modules/` versionado). Previews desta branch: READY desde o 1º commit (`1b5fa06`); o preview serve o mesmo `index.html`/CSS do build local |

Console do navegador: os únicos erros vistos foram imagens do Unsplash bloqueadas pelo proxy do
ambiente de verificação (`ERR_CERT_AUTHORITY_INVALID`) — não são do app.

## Problemas conhecidos e limitações

- **O site no Vercel só volta a ter produção quando este trabalho entrar no `main`.** O Vercel hospeda o `dist/` como site estático, sem a API: mostra o catálogo embutido no build, e as edições feitas no navegador ficam só nele.

- **Editor em produção não envia token:** com o servidor exposto, edições pelo navegador ficam
  locais até existir login. Edição remota hoje = `curl` com token.
- **`site/` legado sem escape de HTML:** risco baixo (dados só do JSON versionado e validado), mas
  real se o JSON for editado sem validação.
- **Fluxo no navegador não tem teste automatizado no CI** (feito manualmente com Chromium headless).
- **Scripts Java não executados no Windows** (feitos para isso; verificados só em Linux).
- **Modelo Java ≠ modelo JSON** — documentado em DATA_MODEL, sem plano de sincronização.

## Bloqueios

Nenhum técnico. Decisões que dependem do dono do projeto:

1. mover o Java para `java/` (DEC-010, proposta);
2. uso da pasta `livros md/`;
3. se/quando portar as páginas do `site/` (leitor, loja, autor) para o Vite.

## Próximo passo

Fase 2 do `docs/ROADMAP.md`: teste de navegador no CI e normalizar `status`/`availability`
(schema v2).
