'use strict';

var path = require('path');
var i18n = require('i18n');

/**
 * Настройка общего синглтона i18n.
 *
 * Живёт отдельно от app.js, потому что зависит от неё не только веб-сервер:
 * PDFKit (а через него и сборка заказа для Homefash) переводит строки через
 * тот же синглтон. Без configure() его вызовы падают с "logDebugFn is not a
 * function" в любом скрипте, запущенном мимо app.js.
 */
i18n.configure({
  locales: ['ru', 'en', 'de', 'ua', 'es', 'it'],
  // Browsers send "uk" for Ukrainian; our locale file is named "ua".
  fallbacks: { uk: 'ua' },
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'ru',
  // Resolve the locale per request from (in priority order) the `lang` query
  // parameter, the `i18next` cookie and the Accept-Language header.
  queryParameter: 'lang',
  cookie: 'i18next',
  // Never let missing keys be written back into the locale files at runtime.
  updateFiles: false,
  autoReload: false,
});

module.exports = i18n;
