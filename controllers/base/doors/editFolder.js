'use strict';

var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Open door folder
 * @param {integer} body.id - Folder id
 * @param {string} body.name - Folder name
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_folders.find({
      where: {
        id: fields.folder_id
      }
    }).then(function (folder) {
      folder.updateAttributes({
        name: fields.name
      }).then(function (updatedFolder) {
        res.send({ status: true, folder: updatedFolder });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false, error: error });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  });
};
