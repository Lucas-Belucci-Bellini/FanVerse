# FanVerse — Desenvolvimento

## Requisitos atuais

O projeto web usa Node.js e npm.

O domínio Java requer JDK/Javac.

## Instalação web

```bash
npm install
```

## Desenvolvimento Vite

```bash
npm run dev
```

A configuração atual usa host `0.0.0.0` e porta `5173`.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Servidor

```bash
npm start
```

## Java — Windows PowerShell

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
java -cp out principal.Principal
```

## Java — Linux/macOS

```bash
javac -d out $(find src -name "*.java")
java -cp out principal.Principal
```

## Validação mínima antes de uma PR

Web:
```bash
npm run build
```

Java:
```text
compilar todas as classes
executar principal.Principal
```

Quando testes automatizados forem adicionados, eles devem se tornar parte da validação obrigatória.

## Princípio

Não afirmar que uma funcionalidade está funcionando apenas porque o código parece correto. Executar a verificação correspondente sempre que possível.
