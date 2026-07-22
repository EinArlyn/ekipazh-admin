var express = require('express');
var router = express.Router();
var analitics = require('../controllers/analitics');

var models = require('../lib/models');
var isAuthenticated = require('../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, getAnalytics);
router.get('/getProductBySellers/:from/:to', analitics.getProductAnaliticsBySeller);
router.get('/getProductByRegions/:from/:to', analitics.getProductAnaliticsByRegions);
router.get('/getAnaliticsEffectiveByRegions/:from/:to', analitics.getAnaliticsEffectiveByRegions);
router.get('/getAnaliticsEffectiveBySeller/:from/:to', analitics.getAnaliticsEffectiveBySeller);

function getAnalytics (req, res) {
  res.render('analytics', {
    title: res.__('Analytics'),
    i18n: res.locals.i18n,
    cssSrcs: ['/assets/stylesheets/analytics.css'],
    scriptSrcs: ['/assets/javascripts/analytics.js']
  });
}

module.exports = router;
