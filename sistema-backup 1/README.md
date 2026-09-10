# Sistema de Biblioteca Java

Este projeto é uma versão isolada do sistema de biblioteca em Java, com foco nos conceitos de Programação Orientada a Objetos.

## Estrutura

```text
sistema-biblioteca-java/
├── README.md
├── src/
│   ├── biblioteca/
│   │   └── Biblioteca.java
│   ├── livros/
│   │   ├── CodigoLivro.java
│   │   ├── Livro.java
│   │   ├── LivroDigital.java
│   │   └── LivroFisico.java
│   ├── principal/
│   │   └── Principal.java
│   └── usuarios/
│       └── Usuario.java
└── out/
```

## Como executar

No Windows PowerShell:

```powershell
Set-Location "C:\Users\Usuario\Desktop\FanVerse\sistema-biblioteca-java"
javac -d out (Get-ChildItem -Recurse -Filter *.java -Path src | ForEach-Object { $_.FullName })
java -cp out principal.Principal
```

## Conceitos aplicados

- Herança
- Polimorfismo
- Encapsulamento
- Composição
- Agregação
- Sobrecarga
- Sobrescrita
- Classes com pacotes e imports
