
module.exports = function(req, res) {
  var error = req.flash('error').toString();

  res.render('login', {
    i18n: res.locals.i18n,
    title: res.__('Login'),
    error: error ? res.__(error) : null,
    cssSrcs: ['/assets/stylesheets/dashboard.css'],
    scriptSrcs: ['/assets/javascripts/login.js']
  });
};
