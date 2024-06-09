var i18n = require('i18n');
var initLocation = require('../../lib/services/locationService').initLocation;

module.exports = function (req, res) {
  initLocation(req.session.user.city_id, function (err, location) {
    if (err) return res.send('Internal server error');

    res.render('add_user', {
      i18n: i18n,
      title: i18n.__('Add user'),
      thisPageLink  : '/add_user/',
      location: location,
      cssSrcs: ['/assets/stylesheets/mynetwork.css'],
      scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/add_user.js']
    });
  });
}
