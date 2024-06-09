'use strict';

var models = require('../../../lib/models');

/**
 * Remove hardware item
 */
module.exports = function (req, res) {
  var itemId = req.body.itemId;

  models.doors_hardware_items.find({
    where: {
      id: itemId
    }
  }).then(function (item) {
    item.destroy().then(function () {
      res.send({ status: true });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
