'use strict';

/**
 * Ошибка интеграции с Homefash.
 *
 * Отделяет проблемы транспорта и подготовки данных от обычных ошибок
 * приложения, чтобы контроллер отдал оператору внятную причину, а не
 * "Internal server error".
 */
class HomefashApiError extends Error {
  /**
   * @param {string} message                — человекочитаемое описание
   * @param {object} [details]
   * @param {string} [details.code]         — 'validation' | 'network' | 'timeout' | 'http'
   * @param {number} [details.status]       — HTTP-статус ответа, если он был
   * @param {*}      [details.body]         — тело ответа как есть
   */
  constructor(message, details) {
    super(message);
    this.name = 'HomefashApiError';
    this.code = (details && details.code) || 'unknown';
    this.status = (details && details.status) || null;
    this.body = details && details.body;
  }
}

module.exports = HomefashApiError;
