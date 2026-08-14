'use strict';

var config = require('./config');
var HomefashApiError = require('./errors');

/**
 * Транспорт для Homefash API.
 *
 * Знает про адрес, авторизацию, таймаут, разбор ответа и режим dryRun —
 * и ничего не знает про заказы. Конкретные эндпоинты живут в resources/.
 */

var LOG_PREFIX = '[homefash]';

function buildHeaders(extra) {
  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
  };

  headers[config.apiKeyHeader] = config.apiKey;

  return Object.assign(headers, extra || {});
}

/**
 * Разбирает ответ, не падая на нестандартном теле: сервер может ответить
 * html-страницей ошибки, и это не повод ронять отправку с SyntaxError.
 */
function parseBody(response) {
  var contentType = response.headers.get('content-type') || '';

  if (contentType.indexOf('json') !== -1) {
    return response.json().catch(function () {
      return null;
    });
  }

  return response.text().catch(function () {
    return null;
  });
}

/**
 * @param {string} method   — HTTP-метод
 * @param {string} path     — путь от корня API, например '/api/orders'
 * @param {object} [body]   — тело запроса, сериализуется в JSON
 * @param {object} [options]
 * @param {boolean} [options.dryRun]  — перекрывает config.dryRun
 * @param {object}  [options.headers] — дополнительные заголовки
 * @returns {Promise<{dryRun: boolean, status: number|null, body: *}>}
 */
function request(method, path, body, options) {
  var opts = options || {};
  var url = config.baseUrl + path;
  var dryRun = opts.dryRun === undefined ? config.dryRun : opts.dryRun;

  if (dryRun) {
    console.log(LOG_PREFIX, 'DRY RUN', method, url);
    console.log(LOG_PREFIX, 'payload:', JSON.stringify(body, null, 2));
    return Promise.resolve({ dryRun: true, status: null, body: null });
  }

  // Без ключа партнёр ответит 401 — понятнее сказать это до запроса
  if (!config.apiKey) {
    return Promise.reject(
      new HomefashApiError('Не задан HOMEFASH_API_KEY', { code: 'validation' }),
    );
  }

  if (typeof fetch !== 'function') {
    return Promise.reject(
      new HomefashApiError('Нужен Node 18+: глобальный fetch недоступен', {
        code: 'network',
      }),
    );
  }

  var controller = new AbortController();
  var timer = setTimeout(function () {
    controller.abort();
  }, config.timeout);

  console.log(LOG_PREFIX, method, url);

  return fetch(url, {
    method: method,
    headers: buildHeaders(opts.headers),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: controller.signal,
  })
    .then(function (response) {
      return parseBody(response).then(function (parsed) {
        if (!response.ok) {
          throw new HomefashApiError('Homefash ответил ' + response.status, {
            code: 'http',
            status: response.status,
            body: parsed,
          });
        }

        console.log(LOG_PREFIX, 'ответ', response.status);
        return { dryRun: false, status: response.status, body: parsed };
      });
    })
    .catch(function (err) {
      if (err instanceof HomefashApiError) {
        throw err;
      }

      if (err.name === 'AbortError') {
        throw new HomefashApiError('Таймаут ' + config.timeout + ' мс', {
          code: 'timeout',
        });
      }

      throw new HomefashApiError('Сеть недоступна: ' + err.message, {
        code: 'network',
      });
    })
    .finally(function () {
      clearTimeout(timer);
    });
}

exports.request = request;
