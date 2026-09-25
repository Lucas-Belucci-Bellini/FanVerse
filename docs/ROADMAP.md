# FanVerse — Roadmap técnico

Construído a partir dos achados reais de `docs/AUDIT.md` (IDs entre parênteses). Fases futuras são
direção, não compromisso: cada uma só começa quando a anterior mostrar que ela é necessária.

Legenda: ✅ concluído · 🔜 próximo · ⏳ futuro · 🚧 bloqueado (depende de decisão)

## Fase 0 — Baseline ✅

- [x] Mapear árvore, componentes, integrações reais e duplicações
- [x] Auditoria técnica com evidência reproduzida (`docs/AUDIT.md`)
- [x] Validação local completa (build, servidor, Java, navegador)
- [x] Classificar ativo × legado (DEC-006)
- [x] Documentação alinhada ao código (STATUS, ARCHITECTURE, DATA_MODEL, API, DEVELOPMENT, DECISIONS)

## Fase 1 — Estabilização ✅

- [x] Parar de versionar `node_modules/`, `dist/`, `out/` — o build no Linux voltou a funcionar (I-01, I-02, DEC-005)
- [x] Fechar leitura arbitrária de arquivos (S-01) e exposição de `/src` (S-04)
- [x] Validar o `PUT` e proteger a escrita (S-02, DEC-008)
- [x] Escape de HTML no frontend principal (S-03)
- [x] "Resetar" não apaga mais o catálogo do servidor (D-01)
- [x] API como fonte de verdade; pendências locais explícitas (D-02, DEC-007)
- [x] Proxy `/api` no dev e catálogo embutido no build (D-03)
- [x] Erros JSON sem vazamento de detalhes (S-05)
- [x] Escrita atômica, serializada, com ETag/If-Match (D-06)
- [x] Java: códigos únicos, contador atômico, busca sem NPE (J-01..J-03)

## Fase 2 — Fundação (em andamento)

- [x] Contrato do catálogo v1 compartilhado cliente/servidor (D-05, DEC-009)
- [x] `site/assets/js/data.js` gerado e checado (D-04)
- [x] 57 testes JS + 12 testes Java; CI no GitHub Actions (I-03, I-04)
- [x] Comandos oficiais verificados e portáteis (J-09)
- [ ] 🔜 Atualizar Vite 5 → 6+ e fechar o aviso do esbuild (S-06)
- [ ] 🔜 Teste de navegador no CI (Playwright) para o fluxo abrir → adicionar → recarregar
- [ ] 🔜 Schema v2: normalizar `status`/`availability` em enums, com migração (D-09)
- [ ] ⏳ Lint (ESLint) com regras mínimas acordadas (I-05)
- [ ] 🚧 Mover o Java para `java/` (DEC-010 — aguarda o dono)

## Fase 3 — Produto

Funcionalidades reais, portando o `site/` (DEC-006) para o frontend principal:

- [ ] ⏳ Navegação por hash (`#/livro/:id`, `#/colecao/:id`) no Vite
- [ ] ⏳ Página do livro e **leitor** (conteúdo em `content`)
- [ ] ⏳ Página da coleção com arcos
- [ ] ⏳ Busca e filtros (tipo, disponibilidade) — hoje só no `site/`
- [ ] ⏳ Página do autor
- [ ] ⏳ Editor: editar/remover livro, escolher arco
- [ ] ⏳ Aposentar o `site/` (nova decisão depois de portado)
- [ ] 🚧 Definir o uso de `livros md/` (textos das obras em Markdown?)

## Fase 4 — Infraestrutura (só quando necessária)

- [ ] ⏳ Autenticação real (substitui o token da DEC-008) — pré-requisito para editar em produção
- [ ] ⏳ Banco de dados (SQLite/PostgreSQL) atrás da mesma interface do `catalog-repository`
- [ ] ⏳ Armazenamento de capas/arquivos
- [ ] ⏳ Deploy do servidor (hoje só há como hospedar o `dist/` estático sem API)
- [ ] ⏳ Observabilidade (logs estruturados)

## Fase 5 — Evolução

- [ ] ⏳ Usuários, biblioteca pessoal, histórico de leitura
- [ ] ⏳ Loja e compras reais (hoje só modelo Java) — exige Fase 4
- [ ] ⏳ Integração Java × web, se o Java virar backend (ADR próprio)

## Regra

Nenhuma fase posterior é compromisso antes de a anterior fornecer informação suficiente.
Cada item concluído atualiza STATUS e, se mudar estrutura, contrato ou decisão, o documento
correspondente.
