'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

/**
 * Get door's hardware
 */
module.exports = function (req, res) {
  res.render('base/doorsHardware/index.jade', {
    i18n: i18n,
    title: i18n.__('Door hardware'),
    cssSrcs: ['/assets/stylesheets/base/index.css', '/assets/stylesheets/base/doorsHardware.css'],
    scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/doorsHardware.js']
  });
};
