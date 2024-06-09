var models = require('../../lib/models');
var initSession = require('../../lib/services/authentication').initSession;
var syncFactory = require('../../lib/services/syncAccount').syncFactory;
var md5 = require('md5');

module.exports = function(req, res) {
  models.users.find({ 
    where: { phone: req.body.login, password: md5(req.body.password) }
  }).then(function (user) {
    if (!user) {
      req.flash('error', 'Invalid login or password');
      return res.redirect('/login');
    }

    initSession(user);
    syncFactory(user.factory_id);
    req.session.level = getLevel(user.user_type);
    req.session.user = user;
    res.redirect('/');
  }).catch(function (error) {
    console.log(error);
    res.redirect('/');
  });
};

function getLevel(type) {
  if (type === 7) {
    return 20;
  } else if (type === 5 || type === 3) {
    return 10;
  } else {
    return 20;
  }
}
