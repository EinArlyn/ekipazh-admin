var i18n = require('i18n');
var isAuthenticated = require('../lib/services/authentication').isAdminAuth;

/**
 * TODO:
 * [1] Orders - secure routes through one handler, move public PDF route to
 *     separate services
 */
module.exports = function(app) {
  // Explicit language switch. Persists the choice in the session and in the
  // `i18next` cookie (also read by the client-side i18next), then returns the
  // user to the page they came from.
  app.get('/set-language', function (req, res) {
    var locale = req.query.locale || req.query.lang;
    if (locale && i18n.getLocales().indexOf(locale) !== -1) {
      if (req.session) {
        req.session.lang = locale;
      }
      res.cookie('i18next', locale, { maxAge: 31536000000, httpOnly: false, path: '/' });
    }
    res.redirect(req.get('Referer') || '/');
  });

  app.use('/', require('./dashboard'));
  app.use('/api', require('./api'));
  app.use('/base/elements', isAuthenticated, require('./base/elements'));
  app.use('/base/element', isAuthenticated, require('./base/element'));
  app.use('/base/sets', require('./base/sets'));
  app.use('/base/set', require('./base/set'));
  app.use('/base/profiles', require('./base/profiles'));
  app.use('/base/doors', isAuthenticated, require('./base/doors'));
  app.use('/base/doors/hardware', isAuthenticated, require('./base/doorsHardware'));
  app.use('/base/options', require('./base/options'));
  app.use('/base/options/folders', require('./base/options/folders'));
  app.use('/base/options/colors', require('./base/options/colors'));
  app.use('/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('/base/hardware', require('./base/hardware'));
  app.use('/base/mosquito', require('./base/mosquito'));
  app.use('/orders', require('./orders'));
  app.use('/mynetwork', isAuthenticated, require('./mynetwork'));
  app.use('/services', require('./services/services'));
  app.use('/analytics', require('./analytics'));
  app.use('/database', require('./services/database'));
  app.use('/base/shields/rolet/rolet', require('./base/shields/rolet/rolet'));
  app.use('/base/shields/rolet/guides', require('./base/shields/rolet/guides'));
  app.use('/base/shields/rolet/endLists', require('./base/shields/rolet/endLists'));
  app.use('/base/shields/rolet/lamels', require('./base/shields/rolet/lamels'));
  app.use('/base/shields/rolet/roletPrice', require('./base/shields/rolet/roletPrice'));
  app.use('/base/shields/rolet/roletBoxHeight', require('./base/shields/rolet/roletBoxHeight'));
  app.use('/base/shields/rolet/roletColorsGroups', require('./base/shields/rolet/roletColorsGroups'));
  app.use('/base/shields/rolet/roletBoxColors', require('./base/shields/rolet/roletBoxColors'));
  app.use('/base/shields/rolet/roletLamelColors', require('./base/shields/rolet/roletLamelColors'));
  app.use('/base/shields/rolet/roletGuideColors', require('./base/shields/rolet/roletGuideColors'));
  app.use('/base/shields/rolet/roletEndListColors', require('./base/shields/rolet/roletEndListColors'));
  app.use('/base/shields/rolet/boxPriceColor', require('./base/shields/rolet/boxPriceColor'));
  app.use('/base/shields/rolet/guidePriceColor', require('./base/shields/rolet/guidePriceColor'));
  app.use('/base/shields/rolet/endListPriceColor', require('./base/shields/rolet/endListPriceColor'));
  app.use('/base/shields/rolet/lamelPriceColor', require('./base/shields/rolet/lamelPriceColor'));
  app.use('/base/shields/rolet/controls', require('./base/shields/rolet/controls'));
  app.use('/base/shields/rolet/controlBoxSizes', require('./base/shields/rolet/controlBoxSizes'));
  app.use('/base/shields/rolet/addElements', require('./base/shields/rolet/addElements'));
  
  app.use('/base/shields/grids/elements', require('./base/shields/grids/elements'));
  app.use('/base/shields/grids/profiles', require('./base/shields/grids/profiles'));
  app.use('/base/shields/grids/grids', require('./base/shields/grids/grids'));
  app.use('/base/shields/grids/systems', require('./base/shields/grids/systems'));
  app.use('/base/shields/grids/colors', require('./base/shields/grids/colors'));
  app.use('/base/shields/grids/colorPrices', require('./base/shields/grids/colorPrices'));
  app.use('/base/shields/grids/templates', require('./base/shields/grids/templates'));
};
