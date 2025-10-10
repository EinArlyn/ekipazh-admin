'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_lamels.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(lamelsList) {
    res.render('base/shields/rolet/lamels', {
          i18n: i18n,
          title: 'Lamels',
          lamelsList: lamelsList,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/lamels.js']
        });
  }).catch(function(err){
    res.send({status: false})
  })
};
