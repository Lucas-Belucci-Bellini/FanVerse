/**
 * Erros HTTP da API. Toda resposta de erro tem o mesmo formato:
 *
 *   { "error": "CODIGO", "message": "texto para humanos", "details": [...]? }
 *
 * `message` foi mantido do formato antigo (`{ message }`) por compatibilidade.
 * Detalhes internos (stack, caminhos de arquivo) só vão para o log do servidor.
 */
export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code, message, details) => new HttpError(400, code, message, details);
export const notFound = (message) => new HttpError(404, 'NOT_FOUND', message);

/** Envolve handlers async para que rejeições cheguem ao middleware de erro (Express 4). */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function errorHandler(logger) {
  // eslint-disable-next-line no-unused-vars -- o Express reconhece o handler de erro pela aridade 4
  return (err, req, res, next) => {
    let status = err.status ?? err.statusCode ?? 500;
    let code = err.code;
    let message = err.message;
    const details = err instanceof HttpError ? err.details : undefined;

    if (err.type === 'entity.parse.failed') {
      status = 400; code = 'INVALID_JSON'; message = 'O corpo da requisição não é um JSON válido.';
    } else if (err.type === 'entity.too.large') {
      status = 413; code = 'PAYLOAD_TOO_LARGE'; message = 'O corpo da requisição excede o limite permitido.';
    } else if (!(err instanceof HttpError)) {
      if (status >= 500) {
        code = 'INTERNAL_ERROR';
        message = 'Erro interno do servidor.';
      } else {
        code = 'BAD_REQUEST';
      }
    }

    if (status >= 500) logger.error(`[${code}] ${req.method} ${req.originalUrl}:`, err.cause ?? err);

    res.status(status).json(details ? { error: code, message, details } : { error: code, message });
  };
}
