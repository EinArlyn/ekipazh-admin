'use strict';

var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_lamels.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(lamelsList) {
    lamelsList.sort((a,b) => a.position - b.position);
    res.render('base/shields/rolet/lamels', {
          i18n: res.locals.i18n,
          title: 'Lamels',
          lamelsList: lamelsList,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/lamels.js']
        });
  }).catch(function(err){
    res.send({status: false})
  })
};
