'use strict';

var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Edit group's item
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false, error: err });

    models.doors_hardware_items.find({
      where: {
        id: fields.item_id
      }
    }).then(function (item) {
      item.updateAttributes({
        min_width: parseInt(fields.width_min, 10),
        max_width: parseInt(fields.width_max, 10),
        min_height: parseInt(fields.height_min, 10),
        max_height: parseInt(fields.height_max, 10),
        direction_id: parseInt(fields.direction_id, 10),
        hardware_color_id: parseInt(fields.color_id, 10),
        length: parseInt(fields['length'], 10) || 0,
        count: parseInt(fields.amount, 10),
        modified: new Date()
      }).then(function (newGroupItem) {
        res.send({ status: true, newGroupItem: newGroupItem });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  });
};
