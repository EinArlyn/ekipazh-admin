'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {
  models.rol_end_lists.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(endLists) {
    endLists.sort((a,b) => a.position - b.position);
    res.render('base/shields/rolet/endLists', {
          i18n: i18n,
          title: 'End Lists',
          endLists: endLists,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/endLists.js']
        });
  }).catch(function(err){
    res.send({status:false})
  })
};
