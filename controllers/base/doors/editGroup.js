'use strict';

var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Edit door group
 * @param {integer} body.id - Group id
 * @param {string} body.name - Group name
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_groups.find({
      where: {
        id: fields.group_id
      }
    }).then(function (group) {
      var newFolder = parseInt(group.folder_id, 10) !== parseInt(fields.folder_id, 10);

      group.updateAttributes({
        name: fields.name,
        folder_id: fields.folder_id
      }).then(function (updatedGroup) {
        res.send({ status: true, group: updatedGroup, newFolder: newFolder });
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
