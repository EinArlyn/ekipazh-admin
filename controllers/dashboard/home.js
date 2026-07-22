var crypto = require('crypto');
var auth = require('../../lib/services/authentication');
var models = require('../../lib/models');
var config = require('../../lib/config');

var algorithm = 'aes-256-ctr';
var salt = 'd6F3Efeq';

var key = "Xc8Kji8hrow7F3ud";  // analitycs crossdomain login secret key
var iv = '1234567890123456';


module.exports = function(req, res) {
  if (auth.checkAuth(req, res)) {
    /** Get accessible routes */
    models.users_accesses.findAll({
      where: {user_id: req.session.user.id},
      attributes: ['menu_id']
    }).then(function(userAccess) {
      var accesses = userAccess.map(function(obj) {
        return obj.dataValues.menu_id;
      });

      var urlKey = nodeEncrypt(req.session.user.id.toString(), key, iv);
      models.cities.find({ where: {id: req.session.user.city_id} }).then(function (city) {
        res.render('dashboard', {
          i18n: res.locals.i18n,
          title: res.__('Dashboard'),
          userName : req.session.user.name,
          userAvatar : req.session.user.avatar,
          userCity : city,
          urlKey: urlKey,
          userToken: req.session.user.device_code,
          proUrl: config.proUrl,
          analitycsUrl: config.analitycsUrl,
          calculatorLink: config.calculatorLink,
          documentsUrl: config.documentsUrl,
          statisticLink: config.statisticLink,
          accesses: accesses,
          lang: res.locals.lang,
          cssSrcs: ['/assets/stylesheets/dashboard.css'],
          scriptSrcs: ['/assets/javascripts/dashboard.js']
        });
      });
    });
  }
};

// added for analitycs crossdomain login
function nodeEncrypt(text, key, iv) {
  var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  var encrypted = cipher.update(text, 'utf8', 'binary');

  encrypted += cipher.final('binary');
  var hexVal = Buffer.from(encrypted, 'binary');
  var newEncrypted = hexVal.toString('hex');
  console.log('Encrypted: ', newEncrypted);
  return newEncrypted;
}
