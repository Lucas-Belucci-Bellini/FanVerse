@echo off
cd /d "%~dp0"
if not exist out mkdir out
if exist fontes.txt del /f /q fontes.txt
dir /b /s src\*.java > fontes.txt
javac -d out @fontes.txt
java -cp out principal.Principal
