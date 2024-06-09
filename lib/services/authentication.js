var util = require('util');
var i18n = require('i18n');
var models = require('../models');

var LEVELS = { GUEST:0, USER:10, FACTORY:20, MANAGER:30, ADMIN:100, SUPERUSER: 19 };

function checkAuth (req, res) {
  // TODO: CHECK LEVEL
  if (req && req.session && req.session.level) {
    return true;
  } else {
    res.redirect('/login');
  }
}

function isAdminAuth (req, res, next) {
  if (req.session.level == LEVELS.ADMIN || req.session.level == LEVELS.FACTORY || req.session.level == LEVELS.USER) {
    next();
  } else {
    res.redirect('/login');
  }
}

function isSuperUser (req, res, next) {
  if (req.session.level == LEVELS.SUPERUSER) {
    next();
  } else {
    res.redirect('/database/login');
  }
}

function initSession (user) {
  models.users_sessions.max('date', {
    where: {
      user_id: user.id
    }
  }).then(function (lastSession) {
    var lastSessionISO = new Date(lastSession);
    var currentSession = new Date();
    lastSessionISO.setHours(lastSessionISO.getHours() + 1);

    if (lastSessionISO > currentSession) return;

    user.updateAttributes({
      updated_at: currentSession
    }).then(function() {
      models.users_sessions.create({
        user_id: parseInt(user.id, 10),
        date: currentSession
      });
    }).catch(function (error) {
      console.log(error);
    });
  }).catch(function (error) {
    console.log(error);
  });
}

exports.LEVELS = LEVELS;
exports.isSuperUser = isSuperUser;
exports.initSession = initSession;
exports.isAdminAuth = isAdminAuth;
exports.checkAuth = checkAuth;
