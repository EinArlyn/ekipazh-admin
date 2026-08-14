'use strict';

var config = require('./config');

/**
 * Кому доступна отправка в Homefash.
 *
 * Логином в этой админке служит users.phone — им же входят в систему
 * (см. controllers/dashboard/signin.js).
 *
 * @param {object} user — req.session.user
 * @returns {boolean}
 */
exports.isAllowedUser = function (user) {
  if (!user || !user.phone) {
    return false;
  }

  var login = String(user.phone).trim().toLowerCase();

  return config.allowedLogins.indexOf(login) !== -1;
};
