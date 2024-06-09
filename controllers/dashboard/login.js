var i18n = require('i18n');

module.exports = function(req, res) {
  var error = req.flash('error').toString();

  res.render('login', {
    i18n: i18n,
    title: i18n.__('Login'),
    error: error ? i18n.__(error) : null,
    cssSrcs: ['/assets/stylesheets/dashboard.css'],
    scriptSrcs: ['/assets/javascripts/login.js']
  });
};
