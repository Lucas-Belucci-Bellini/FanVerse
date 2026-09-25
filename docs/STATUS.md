# FanVerse — Estado Atual

**Data do levantamento:** 2026-09-24  
**Branch de documentação:** `docs/project-baseline`  
**Base analisada:** `main` no commit `8eacb09479340ff89998499e5182d0eb32d49392`

## Resumo

O FanVerse é atualmente um projeto híbrido que reúne um domínio acadêmico em Java e uma aplicação web baseada em Vite + JavaScript + CSS, apoiada por um servidor Node/Express e um catálogo JSON.

Há também uma segunda interface em `site/`, composta por páginas HTML estáticas e seus próprios arquivos JavaScript/CSS.

## Componentes encontrados

| Componente | Estado observado |
|---|---|
| Modelo Java | Existe e possui várias classes de domínio |
| Frontend Vite | Existe |
| API Express | Existe |
| Catálogo JSON | Existe |
| Site estático `site/` | Existe |
| Documentação | Existe, mas ainda era principalmente descritiva por arquivo |
| Testes automatizados | Não identificados no levantamento inicial |
| Banco de dados | Não identificado |
| Autenticação | Não identificada |
| Pagamento real | Não existe; compras são representações de domínio |
| Integração Java ↔ API web | Não identificada como integração direta |
| CI/CD documentado | Não identificado |
| `node_modules/` versionado | Sim |
| `out/` versionado | Sim |
| `dist/` versionado | Sim |

## Fluxo web atual

A aplicação web principal usa:

`index.html` → `src/main.js` + `src/style.css`

O frontend trabalha com catálogo local, API e dados de fallback.

O servidor usa Express e mantém `data/catalogo.json`.

## Fluxo Java atual

`src/principal/Principal.java` cria objetos de:
- livros digitais;
- livros físicos;
- usuário;
- biblioteca;
- coleção;
- catálogo;
- compra.

O fluxo também demonstra herança, polimorfismo, sobrecarga, encapsulamento e validações.

## Pontos de atenção

### 1. Múltiplas interfaces

Existem duas abordagens web:
- frontend Vite na raiz;
- site estático em `site/`.

Antes de consolidar ou remover uma delas, mapear dependências e objetivo de cada uma.

### 2. Artefatos versionados

A árvore atual contém `node_modules/`, `out/` e `dist/`. O `.gitignore` possui regras para alguns desses diretórios, mas os arquivos já aparecem versionados.

Isso deve ser tratado como tarefa própria, não como efeito colateral de uma feature.

### 3. Dados duplicados

O catálogo existe em `data/catalogo.json`, enquanto o site estático possui dados próprios em `site/assets/js/data.js` e o frontend possui mecanismos de fallback.

Isso pode gerar divergência de conteúdo.

### 4. API simples

A API atual persiste diretamente o catálogo JSON. Ainda não há indicação de banco de dados, autenticação ou controle de concorrência.

### 5. Modelo Java e web

O domínio Java e o catálogo web representam conceitos relacionados, mas não há evidência no estado atual de que o frontend consuma diretamente as classes Java.

## Próxima fase

A próxima fase deve ser de entendimento e planejamento, não de reescrita imediata:

1. consolidar documentação;
2. mapear arquitetura;
3. mapear modelo de dados;
4. mapear API;
5. definir o papel do site legado;
6. definir backlog;
7. só então começar implementação incremental.
