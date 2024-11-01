'use strict';

var fs = require('fs');
var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Edit door group
 * @param {integer} body.id - Group id
 * @param {string} body.name - Group name
 */
module.exports = function (req, res) {
  var imageUrl = '';
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
        folder_id: fields.folder_id,
        description: fields.description
      }).then(function (updatedGroup) {

        if (files.doors_group_img.name) {
          fs.readFile(files.doors_group_img.path, function(err, data) {
            if (err) console.log('Image upload error. Error: ' + err);
            imageUrl = '/local_storage/profiles/' + Math.floor(Math.random()*1000000) + files.doors_group_img.name;
            fs.writeFile('.' + imageUrl, data, function(err) {});
            __saveDoorsGroupImg(fields.group_id, imageUrl);
          });
        }

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

  function __saveDoorsGroupImg(id, url) {
    models.doors_groups.find({
      where: {id: id}
    }).then(function(doorsGroup) {
      doorsGroup.updateAttributes({
        img: url
      });
    });
  }
};
