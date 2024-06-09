'use strict';

var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser.js').parseForm;

/**
 * Add new door folder
 * @param {string} body.name - New folder name
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_folders.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      type: 1,
      modified: new Date()
    }).then(function (newFolder) {
      res.send({ status: true, folder: newFolder });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  });
};
