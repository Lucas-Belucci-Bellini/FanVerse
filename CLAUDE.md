# FanVerse — Regras para Claude Code

## 1. Regra principal

**Antes de implementar qualquer funcionalidade, primeiro compreender e documentar o estado atual do repositório.**

Nenhuma mudança de arquitetura, refatoração grande ou criação de módulo deve começar sem:
1. inspeção do código existente;
2. atualização da documentação afetada;
3. registro da decisão quando houver impacto arquitetural;
4. definição clara do objetivo e do critério de conclusão.

## 2. Fonte de verdade

- O código existente é a fonte de verdade sobre o comportamento atual.
- A documentação descreve esse comportamento e deve ser atualizada quando o código mudar.
- Não inventar funcionalidades que não existem.
- Quando houver conflito entre documentação e código, verificar o código e registrar a divergência.

## 3. Antes de editar

Sempre:
- inspecionar a árvore do projeto;
- identificar frontend, backend, Java, dados e páginas legadas;
- verificar scripts do package.json;
- verificar arquivos de configuração;
- procurar testes existentes;
- verificar o estado do Git;
- executar verificações disponíveis quando forem seguras;
- registrar riscos e limitações encontrados.

## 4. Documentação obrigatória

Mudanças relevantes devem atualizar, quando aplicável:
- `docs/STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/API.md`
- `docs/DEVELOPMENT.md`
- `docs/DECISIONS.md`
- `docs/ROADMAP.md`

Se uma mudança criar uma nova responsabilidade, arquivo importante, endpoint, modelo de dados ou fluxo, documentar antes ou junto da implementação.

## 5. Não apagar sem justificar

Não remover código, páginas, dados ou estruturas existentes apenas para "limpar" o projeto.

Antes de remover algo:
- identificar dependências;
- explicar o motivo;
- verificar se é código legado, referência acadêmica ou parte ativa;
- registrar a decisão;
- só então remover, se a remoção fizer parte do objetivo.

## 6. Separação atual do projeto

O FanVerse possui atualmente:
- domínio acadêmico em Java;
- frontend Vite na raiz;
- API Node/Express;
- catálogo JSON;
- site HTML/CSS/JS legado em `site/`.

Não assumir que essas partes já formam uma única aplicação integrada.

## 7. Validação

Depois de alterações:
- executar `npm run build` para mudanças web quando possível;
- executar a compilação Java quando houver mudança Java;
- verificar erros de console quando houver execução do frontend;
- testar endpoints alterados;
- documentar resultados reais, não resultados presumidos.

## 8. Commits

Usar commits pequenos e descritivos.

Exemplos:
- `docs: establish project baseline`
- `docs: document catalog data model`
- `feat: add catalog filtering`
- `fix: validate catalog update payload`

## 9. Escopo

Não transformar uma tarefa pequena em uma reescrita completa.

Primeiro corrigir ou implementar o que foi solicitado. Melhorias maiores devem virar uma decisão/issue separada.

## 10. Critério de conclusão

Uma tarefa só está concluída quando:
- código e documentação estão coerentes;
- verificações relevantes foram executadas;
- limitações conhecidas foram registradas;
- não existem afirmações de "funciona" sem validação;
- o próximo passo está claro.
