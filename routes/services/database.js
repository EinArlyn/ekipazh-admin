var express = require('express');
var router = express.Router();
var models = require('../../lib/models');
var i18n = require('i18n');
var md5 = require('md5');
var isSuperUser = require('../../lib/services/authentication').isSuperUser;

router.get('/login', getDatabaseFunctionalyties);
router.post('/login', getDatabaseFunctionalytiesLogin);
router.get('/', isSuperUser, getAdminFunctionalyties);

/** Login page for admin access */
function getDatabaseFunctionalyties(req, res) {
  res.render('services/database/login', {
    title: 'Admin access',
    scriptSrcs: []
  });
}

/** 
 * Login in for admin 
 * @param {string}  login
 * @param {string}  password
 */
function getDatabaseFunctionalytiesLogin(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  models.users.find({
    where: {phone: login, password: md5(password)}
  }).then(function(user) {
    if (user && user.user_type === 19) {
      req.session.user = user;
      req.session.level = user.user_type;
      res.redirect('/database');
    } else {
      res.redirect('/database/login');
    }
  }).catch(function(err) {
    console.log(err);
    res.redirect('/database/login');
  });
}

function getAdminFunctionalyties(req, res) {
  res.render('services/database/index', {
    title: 'Admin dashboard',
    cssSrc: '/assets/stylesheets/services/database.css',
    scriptSrcs: ['/assets/javascripts/services/database.js']
  });
}

module.exports = router; 