'use strict';

var i18n = require('i18n');
var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../lib/services/imageLoader.js').loadImage;

/**
 * Edit door's hardware group
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_hardware_groups.find({
      where: {
        id: fields.hardware_group_id
      }
    }).then(function (hardwareGroup) {
      var isActive = fields.is_active ? 1 : 0;
      var isPush = fields.is_push ? 1 : 0;

      hardwareGroup.updateAttributes({
        name: fields.name,
        producer: fields.producer,
        country: fields.country,
        link: fields.link,
        description: fields.description,
        anticorrosion_coeff: parseInt(fields.anticorrosion_coeff, 10),
        burglar_coeff: parseInt(fields.burglar_coeff, 10),
        modified: new Date(),
        type: parseInt(fields.type, 10),
        width_min: parseInt(fields.width_min, 10),
        width_max: parseInt(fields.width_max, 10),
        height_min: parseInt(fields.height_min, 10),
        height_max: parseInt(fields.height_max, 10),
        is_active: isActive,
        is_push: isPush
      }).then(function (newGroup) {
        if (!files.group_image.name) return res.send({ status: true, group: newGroup });

        var imageUrl = '/local_storage/hardware_groups/' + Math.floor(Math.random() * 1000000) + files.group_image.name;
        loadImage(files.group_image.path, imageUrl);
        newGroup.updateAttributes({
          image: imageUrl
        }).then(function (newGroup) {
          res.send({ status: true, group: newGroup });
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false, error: error });
        });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false, error: error });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: true, error: error });
    });
  });
};
