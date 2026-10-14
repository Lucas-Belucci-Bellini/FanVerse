import { createHash } from 'node:crypto';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';

import { HttpError } from './errors.js';

/**
 * Persistência do catálogo em arquivo JSON.
 *
 * - Escrita atômica: grava num arquivo temporário e renomeia por cima, então uma
 *   queda no meio da gravação não deixa o catálogo truncado.
 * - Escritas serializadas: uma fila impede que dois PUT simultâneos se intercalem.
 * - ETag: hash do conteúdo em disco, usado para detectar edição concorrente
 *   (`If-Match` → 412 quando o arquivo mudou desde a leitura do cliente).
 */
export function createCatalogRepository(dataPath) {
  let queue = Promise.resolve();

  const etagOf = (raw) => `"${createHash('sha256').update(raw).digest('hex').slice(0, 32)}"`;

  async function readRaw() {
    try {
      return await readFile(dataPath, 'utf-8');
    } catch (cause) {
      throw Object.assign(new HttpError(500, 'PERSISTENCE_ERROR', 'Não foi possível ler o catálogo.'), { cause });
    }
  }

  async function read() {
    const raw = await readRaw();
    try {
      return { catalog: JSON.parse(raw), etag: etagOf(raw) };
    } catch (cause) {
      throw Object.assign(new HttpError(500, 'PERSISTENCE_ERROR', 'O arquivo do catálogo está corrompido.'), { cause });
    }
  }

  /**
   * Grava o catálogo. Se `ifMatch` vier, só grava quando o ETag atual bate.
   * A verificação e a gravação rodam dentro da mesma posição da fila.
   */
  function write(catalog, { ifMatch } = {}) {
    const task = queue.then(async () => {
      if (ifMatch && ifMatch !== '*') {
        const current = etagOf(await readRaw());
        if (current !== ifMatch) {
          throw new HttpError(412, 'PRECONDITION_FAILED',
            'O catálogo foi alterado por outra pessoa desde a última leitura. Recarregue antes de salvar.');
        }
      }
      const raw = `${JSON.stringify(catalog, null, 2)}\n`;
      const tmp = `${dataPath}.${process.pid}.tmp`;
      try {
        await writeFile(tmp, raw, 'utf-8');
        await rename(tmp, dataPath);
      } catch (cause) {
        await rm(tmp, { force: true }).catch(() => {});
        throw Object.assign(new HttpError(500, 'PERSISTENCE_ERROR', 'Não foi possível salvar o catálogo.'), { cause });
      }
      return { catalog, etag: etagOf(raw) };
    });
    // A fila segue mesmo se esta escrita falhar.
    queue = task.catch(() => {});
    return task;
  }

  return { read, write };
}
