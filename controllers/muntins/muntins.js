'use strict';

var i18n = require('i18n');
var models = require('../../lib/models');

module.exports = function (req, res) {

      const types = [
        { id: 1, name: i18n.__('sh_internal') },
        { id: 2, name: i18n.__('sh_external') },
        { id: 3, name: i18n.__('sh_struct') },
      ]

      models.muntins.findAll({
        where: {factory_id: req.session.user.factory_id},
      }).then(muntins => {
        types.forEach(type => {
          type.muntins = muntins.filter(muntin => muntin.type_id === type.id).sort((a, b) => a.position - b.position);
        })
        res.render('base/muntins/muntins', {
          i18n: i18n,
          title: 'Muntins',
          types: types,
          cssSrcs: ['/assets/stylesheets/base/muntins.css'],
          scriptSrcs: [
            '/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
            '/assets/javascripts/base/muntins.js',
          ],
        });
      })

 
};
