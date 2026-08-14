// Compatibility patch: Sequelize v3 expects pg to return an EventEmitter from
// client.query() (using .on('row'/.on('end')), but pg v8 returns a Promise.
// This patch wraps pg v8's Promise result in an EventEmitter so Sequelize v3
// can attach its .on() listeners without modification.
//
// Требуется до первого обращения к моделям — не только в app.js, но и в любом
// скрипте, который работает с БД напрямую.
var EventEmitter = require('events');
var pg = require('pg');

var _pgQuery = pg.Client.prototype.query;

if (_pgQuery && !_pgQuery.__sequelizeV3Patched) {
  pg.Client.prototype.query = function (config, values, callback) {
    var result = _pgQuery.call(this, config, values, callback);
    if (
      result &&
      typeof result.then === 'function' &&
      typeof result.on !== 'function'
    ) {
      var emitter = new EventEmitter();
      result
        .then(function (res) {
          if (res && res.rows) {
            res.rows.forEach(function (row) {
              emitter.emit('row', row);
            });
          }
          emitter.emit('end', res);
        })
        .catch(function (err) {
          emitter.emit('error', err);
        });
      return emitter;
    }
    return result;
  };

  pg.Client.prototype.query.__sequelizeV3Patched = true;
}
