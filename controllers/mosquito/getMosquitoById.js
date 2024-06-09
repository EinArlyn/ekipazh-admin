'use strict';

var models = require('../../lib/models');

/**
 * Get mosquioto by ID
 */
module.exports = function (req, res) {
  var mosquiotoId = req.params.id;

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
