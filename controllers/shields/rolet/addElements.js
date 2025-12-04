'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');

module.exports = function (req, res) {

  models.rol_add_elements.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(addElements) {
    addElements.sort((a,b) => a.position - b.position);
    res.render('base/shields/rolet/addElements', {
          i18n: i18n,
          title: 'AddElements',
          addElements: addElements,
          cssSrcs: ['/assets/stylesheets/base/shields/rolet.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/shields/rolet/addElements.js']
        });
  }).catch(function(err){
    res.send({status: false})
  })
};
