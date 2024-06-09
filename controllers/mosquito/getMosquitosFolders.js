'use strict';

var models = require('../../lib/models');

/**
 * Get mosquioto's folders
 */
module.exports = function (req, res) {
  models.addition_folders.findAll({
    where: {
      factory_id: req.session.user.factory_id,
      addition_type_id: 12
    }
  }).then(function (mosquitosFolders) {
    res.send({
      status: true,
      folders: mosquitosFolders
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
