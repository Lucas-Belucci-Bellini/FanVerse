# Documentação do FanVerse

Índice da pasta `docs/`. Comece pelo `STATUS.md` para saber onde o projeto está e pelo
`DEVELOPMENT.md` para rodar.

| Documento | Para quê |
|---|---|
| [`STATUS.md`](STATUS.md) | Estado atual, verificações executadas, limitações e bloqueios |
| [`AUDIT.md`](AUDIT.md) | Auditoria técnica: cada achado com evidência e status |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Partes do sistema, camadas, módulos, fluxos e arquitetura alvo |
| [`DATA_MODEL.md`](DATA_MODEL.md) | Contrato do catálogo JSON (v1) e modelo Java |
| [`API.md`](API.md) | Endpoints, erros, autorização e exemplos |
| [`DEVELOPMENT.md`](DEVELOPMENT.md) | Instalação, comandos oficiais, variáveis de ambiente, testes, CI |
| [`DECISIONS.md`](DECISIONS.md) | Decisões arquiteturais (DEC-001 em diante) |
| [`ROADMAP.md`](ROADMAP.md) | Fases 0–5: concluído, próximo, futuro, bloqueado |
| [`documentacao-arquivos.md`](documentacao-arquivos.md) | Guia arquivo por arquivo (HTML, CSS, JS, Java) para estudo |

Regras de trabalho para agentes: [`../CLAUDE.md`](../CLAUDE.md). Visão geral e início rápido:
[`../README.md`](../README.md).

## Em uma frase por parte

- **Java** (`src/**/*.java`): modelo acadêmico de biblioteca — livros, usuário, catálogo, coleções,
  compra. Roda sozinho (`npm run java:run`), não conversa com a web.
- **Frontend Vite** (`index.html`, `src/main.js`, `src/app/`): interface principal com catálogo e editor.
- **API** (`server.js`, `server/`): lê e grava `data/catalogo.json` com validação.
- **Contrato** (`shared/catalog.js`): regras do catálogo usadas pelos dois lados.
- **Site legado** (`site/`): 7 páginas estáticas, congeladas, com dados gerados do JSON.
