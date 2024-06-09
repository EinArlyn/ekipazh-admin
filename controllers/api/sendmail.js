var sendActivationEmail = require('../../lib/services/mailer').sendActivationEmail;

module.exports = function(req, res) {
  sendActivationEmail('exille13@gmail.com');
  res.end();
};
