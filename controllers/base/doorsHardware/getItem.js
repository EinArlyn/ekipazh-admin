'use strict';

var models = require('../../../lib/models');

/**
 * Get group's item
 */
module.exports = function (req, res) {
  var itemId = req.params.id;

  models.doors_hardware_items.find({
    where: {
      id: itemId
    }
  }).then(function (item) {
    models.lamination_factory_colors.findAll({
      where: { factory_id: req.session.user.factory_id }
    }).then(function function_name (colors) {
      res.send({
        status: true,
        item: item,
        colors: colors
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
