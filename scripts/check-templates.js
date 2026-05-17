'use strict';

/**
 * Компилирует все .pug шаблоны и выводит список ошибок.
 * Запуск: npm run lint:pug
 */

var pug = require('pug');
var path = require('path');
var fs = require('fs');

var viewsDir = path.join(__dirname, '..', 'views');

function findPugFiles(dir) {
  var results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(function (entry) {
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findPugFiles(fullPath));
    } else if (entry.name.endsWith('.pug')) {
      results.push(fullPath);
    }
  });
  return results;
}

var files = findPugFiles(viewsDir);
var errors = [];

files.forEach(function (file) {
  try {
    var src = fs.readFileSync(file, 'utf8');
    pug.compile(src, { filename: file });
  } catch (err) {
    // Игнорируем ошибки разрешения include/extends — они зависят от контекста рендеринга.
    // Нас интересуют только синтаксические ошибки самого файла.
    if (err.message && err.message.includes('ENOENT')) {
      return;
    }
    errors.push({
      file: path.relative(viewsDir, file),
      message: err.message ? err.message.split('\n').slice(0, 4).join('\n    ') : String(err),
    });
  }
});

if (errors.length > 0) {
  console.error('\nНайдено ошибок в шаблонах: ' + errors.length + '\n');
  errors.forEach(function (e) {
    console.error('  ✗ ' + e.file);
    console.error('    ' + e.message);
    console.error('');
  });
  process.exit(1);
} else {
  console.log('\n✓ Все ' + files.length + ' шаблонов без ошибок\n');
}
