import { timingSafeEqual } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';

import express from 'express';

import { findBook, findCollection, flattenBooks, validateCatalog, withSchemaVersion } from '../shared/catalog.js';
import { createCatalogRepository } from './catalog-repository.js';
import { HttpError, asyncHandler, badRequest, errorHandler, notFound } from './errors.js';

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

const sameSecret = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
};

/**
 * Autorização da escrita do catálogo (ver DEC-008):
 * - com `adminToken` configurado: exige `Authorization: Bearer <token>`;
 * - sem token: só aceita requisições vindas da própria máquina (loopback).
 */
export function requireWriteAccess(adminToken) {
  return (req, res, next) => {
    if (adminToken) {
      const header = req.get('authorization') ?? '';
      const [scheme, token] = header.split(' ');
      if (scheme !== 'Bearer' || !token || !sameSecret(token, adminToken)) {
        return next(new HttpError(401, 'UNAUTHORIZED', 'Token de administrador ausente ou inválido.'));
      }
      return next();
    }
    if (!LOOPBACK.has(req.socket.remoteAddress)) {
      return next(new HttpError(403, 'FORBIDDEN',
        'Escrita do catálogo liberada apenas localmente. Configure FANVERSE_ADMIN_TOKEN para editar remotamente.'));
    }
    return next();
  };
}

/**
 * Monta o app Express sem abrir porta — `server.js` faz o `listen`, os testes
 * usam porta efêmera e um arquivo de dados temporário.
 *
 * @param {object} options
 * @param {string} options.dataPath caminho do catálogo JSON
 * @param {string} [options.distDir] build do frontend Vite (servido em `/`)
 * @param {string} [options.siteDir] site estático legado (servido em `/site/`)
 * @param {string} [options.adminToken] token exigido no PUT; vazio = só loopback
 * @param {Pick<Console, 'error' | 'warn'>} [options.logger]
 */
export function createApp({ dataPath, distDir, siteDir, adminToken, logger = console }) {
  const app = express();
  const repository = createCatalogRepository(dataPath);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '2mb' }));

  // ---------------------------------------------------------------- API
  const api = express.Router();

  api.get('/health', (req, res) => res.json({ status: 'ok' }));

  api.get('/catalogo', asyncHandler(async (req, res) => {
    const { catalog, etag } = await repository.read();
    res.set('ETag', etag).set('Cache-Control', 'no-store').json(catalog);
  }));

  api.put('/catalogo', requireWriteAccess(adminToken), asyncHandler(async (req, res) => {
    const result = validateCatalog(req.body);
    if (!result.ok) {
      throw badRequest('VALIDATION_ERROR', 'O catálogo enviado não segue o contrato.', result.errors);
    }
    const { catalog, etag } = await repository.write(withSchemaVersion(req.body), { ifMatch: req.get('if-match') });
    res.set('ETag', etag).json({ message: 'Catálogo atualizado com sucesso.', catalog });
  }));

  api.get('/catalogo/books', asyncHandler(async (req, res) => {
    const { catalog } = await repository.read();
    res.json(flattenBooks(catalog));
  }));

  api.get('/catalogo/book/:id', asyncHandler(async (req, res) => {
    const book = findBook((await repository.read()).catalog, req.params.id);
    if (!book) throw notFound('Livro não encontrado.');
    res.json(book);
  }));

  api.get('/catalogo/collection/:id', asyncHandler(async (req, res) => {
    const collection = findCollection((await repository.read()).catalog, req.params.id);
    if (!collection) throw notFound('Coleção não encontrada.');
    res.json(collection);
  }));

  // Rota de API inexistente responde JSON, nunca a página HTML.
  api.use((req, res, next) => next(notFound('Rota de API não encontrada.')));

  app.use('/api', api);

  // -------------------------------------------------------- Arquivos estáticos
  // express.static confina cada caminho à sua pasta (recusa `..`). Não há mais
  // handler curinga montando caminhos à mão — era ele que permitia ler qualquer
  // arquivo do disco (ver AUDIT.md, achado S-01).
  const hasDist = Boolean(distDir) && existsSync(path.join(distDir, 'index.html'));

  if (siteDir) {
    app.use('/site', express.static(siteDir));
    // Links antigos (`/catalogo.html`, `/livro.html?id=…`) apontavam para a raiz.
    app.get('/:page([a-z]+\\.html)', (req, res, next) => {
      if (hasDist && req.params.page === 'index.html') return next();
      if (!existsSync(path.join(siteDir, req.params.page))) return next();
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(301, `/site/${req.params.page}${query}`);
    });
  }

  if (hasDist) {
    app.use(express.static(distDir));
  } else {
    logger.warn('Build do frontend não encontrado (rode `npm run build`). A raiz redireciona para /site/.');
    app.get('/', (req, res) => res.redirect(302, siteDir ? '/site/' : '/api/health'));
  }

  app.use((req, res) => res.status(404).type('text/plain').send('Não encontrado.'));
  app.use(errorHandler(logger));

  return app;
}
