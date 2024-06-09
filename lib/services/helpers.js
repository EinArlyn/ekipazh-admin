var models = require('../models');

exports.getIncludedUsers = getIncludedUsers;

function getIncludedUsers (userId, from, to, lights, lvl, currentLvl) {
  if (lvl && parseInt(lvl, 10) === parseInt(currentLvl, 10)) return;

  return models.sequelize.query('' +
    'SELECT users.id, users.parent_id, users.name, users.avatar, users.identificator, users.updated_at, users.updated_at ' +
      // '(SELECT COUNT(*) FROM users_sessions WHERE users_sessions.user_id = users.id AND users_sessions.date BETWEEN \'' + from + '\' AND \'' + to + '\'' + ') AS sessions ' +
      // '(SELECT COUNT(*) FROM order_prices WHERE order_prices.user_id = users.id AND order_prices.modified BETWEEN \'' + from + '\' AND \'' + to + '\' AND order_prices.is_own = 1 ' + ') AS orders ' +
    'FROM users ' +
    'WHERE users.parent_id = ' + userId +
    ' GROUP BY users.id ' +
    'ORDER BY users.name' +
  '').then(function(includedUsers) {
    if (includedUsers[0]) {
      for (var i = 0; i < includedUsers[0].length; i++) {
        includedUsers[0][i].includedUsers = getIncludedUsers(includedUsers[0][i].id, from, to, lights, lvl, currentLvl++);
      }
      return includedUsers[0];
    } else {
      return;
    }
  });
}
