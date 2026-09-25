# FanVerse — API Atual

## Base

O servidor é implementado em `server.js` usando Express.

## Endpoints

| Método | Endpoint | Função |
|---|---|---|
| GET | `/api/catalogo` | Retorna o catálogo completo |
| PUT | `/api/catalogo` | Substitui/salva o catálogo recebido |
| GET | `/api/catalogo/books` | Lista livros |
| GET | `/api/catalogo/book/:id` | Busca um livro |
| GET | `/api/catalogo/collection/:id` | Busca uma coleção |

## Persistência

O endpoint de atualização grava o conteúdo recebido em:

`data/catalogo.json`

## Contrato atual

O catálogo é estruturado como autor → coleções → arcos → livros.

O contrato deve ser tratado como o formato existente, não como uma API versionada formalmente.

## Segurança e produção

No estado documentado, não há evidência de:
- autenticação;
- autorização;
- rate limiting;
- banco de dados;
- auditoria de alterações;
- versionamento de API;
- controle de concorrência para escrita do JSON.

Isso não significa que esses itens sejam obrigatórios imediatamente; apenas que não fazem parte do contrato atual documentado.

## Regra para futuras alterações

Qualquer alteração de endpoint deve atualizar este documento e registrar:
- endpoint;
- método;
- entrada;
- saída;
- erros esperados;
- impacto no frontend.
