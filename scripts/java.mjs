/**
 * Compila e executa o domínio Java sem depender do shell (funciona igual no
 * Windows, Linux e macOS). Requer JDK 17+ no PATH (`javac` e `java`).
 *
 *   npm run java:build   compila src/**\/*.java para out/
 *   npm run java:run     compila e executa principal.Principal
 *   npm run test:java    compila src + test/java e executa testes.DominioTest
 */
import { spawnSync } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = path.join(ROOT, 'out');

function javaFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return javaFiles(full);
    return entry.name.endsWith('.java') ? [full] : [];
  });
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.error?.code === 'ENOENT') {
    console.error(`"${command}" não encontrado. Instale um JDK 17+ e coloque-o no PATH.`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function compile(withTests) {
  rmSync(OUT, { recursive: true, force: true });
  const sources = [...javaFiles(path.join(ROOT, 'src')), ...(withTests ? javaFiles(path.join(ROOT, 'test', 'java')) : [])];
  run('javac', ['-encoding', 'UTF-8', '-Xlint:all,-this-escape', '-Werror', '-d', OUT, ...sources]);
}

// stdout.encoding: acentos corretos no console do Windows e em terminais sem UTF-8.
const JAVA_FLAGS = ['-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', '-cp', OUT];

const command = process.argv[2];
if (command === 'build') {
  compile(false);
  console.log('Java compilado em out/.');
} else if (command === 'run') {
  compile(false);
  run('java', [...JAVA_FLAGS, 'principal.Principal']);
} else if (command === 'test') {
  compile(true);
  run('java', ['-ea', ...JAVA_FLAGS, 'testes.DominioTest']);
} else {
  console.error('Uso: node scripts/java.mjs <build|run|test>');
  process.exit(1);
}
