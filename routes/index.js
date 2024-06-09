var isAuthenticated = require('../lib/services/authentication').isAdminAuth;

/**
 * TODO:
 * [1] Orders - secure routes through one handler, move public PDF route to
 *     separate services
 */
module.exports = function(app) {
  app.use('/', require('./dashboard'));
  app.use('/ru', require('./dashboard'));
  app.use('/ua', require('./dashboard_ua'));
  app.use('/es', require('./dashboard'));
  app.use('/en', require('./dashboard'));
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
  app.use('/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('/base/hardware', require('./base/hardware'));
  app.use('/base/mosquito', require('./base/mosquito'));
  app.use('ru/base/elements', isAuthenticated, require('./base/elements'));
  app.use('ru/base/element', isAuthenticated, require('./base/element'));
  app.use('ru/base/sets', require('./base/sets'));
  app.use('ru/base/set', require('./base/set'));
  app.use('ru/base/profiles', require('./base/profiles'));
  app.use('ru/base/doors', isAuthenticated, require('./base/doors'));
  app.use('ru/base/doors/hardware', isAuthenticated, require('./base/doorsHardware'));
  app.use('ru/base/options', require('./base/options'));
  app.use('ru/base/options/folders', require('./base/options/folders'));
  app.use('ru/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('ru/base/hardware', require('./base/hardware'));
  app.use('ru/base/mosquito', require('./base/mosquito'));
  app.use('ua/base/elements', isAuthenticated, require('./base/elements'));
  app.use('ua/base/element', isAuthenticated, require('./base/element'));
  app.use('ua/base/sets', require('./base/sets'));
  app.use('ua/base/set', require('./base/set'));
  app.use('ua/base/profiles', require('./base/profiles'));
  app.use('ua/base/doors', isAuthenticated, require('./base/doors'));
  app.use('ua/base/doors/hardware', isAuthenticated, require('./base/doorsHardware'));
  app.use('ua/base/options', require('./base/options'));
  app.use('ua/base/options/folders', require('./base/options/folders'));
  app.use('ua/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('ua/base/hardware', require('./base/hardware'));
  app.use('ua/base/mosquito', require('./base/mosquito'));
  app.use('en/base/elements', isAuthenticated, require('./base/elements'));
  app.use('en/base/element', isAuthenticated, require('./base/element'));
  app.use('en/base/sets', require('./base/sets'));
  app.use('en/base/set', require('./base/set'));
  app.use('en/base/profiles', require('./base/profiles'));
  app.use('en/base/doors', isAuthenticated, require('./base/doors'));
  app.use('en/base/doors/hardware', isAuthenticated, require('./base/doorsHardware'));
  app.use('en/base/options', require('./base/options'));
  app.use('en/base/options/folders', require('./base/options/folders'));
  app.use('en/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('en/base/hardware', require('./base/hardware'));
  app.use('en/base/mosquito', require('./base/mosquito'));
  app.use('es/base/elements', isAuthenticated, require('./base/elements'));
  app.use('es/base/element', isAuthenticated, require('./base/element'));
  app.use('es/base/sets', require('./base/sets'));
  app.use('es/base/set', require('./base/set'));
  app.use('es/base/profiles', require('./base/profiles'));
  app.use('es/base/doors', isAuthenticated, require('./base/doors'));
  app.use('es/base/doors/hardware', isAuthenticated, require('./base/doorsHardware'));
  app.use('es/base/options', require('./base/options'));
  app.use('es/base/options/folders', require('./base/options/folders'));
  app.use('es/base/glazedWindow', isAuthenticated, require('./base/glazedWindow'));
  app.use('es/base/hardware', require('./base/hardware'));
  app.use('es/base/mosquito', require('./base/mosquito'));
  app.use('/orders', require('./orders'));
  app.use('/mynetwork', isAuthenticated, require('./mynetwork'));
  app.use('/services', require('./services/services'));
  app.use('/analytics', require('./analytics'));
  app.use('/database', require('./services/database'));
};
