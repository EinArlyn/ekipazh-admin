'use strict';

var models = require('../../../lib/models');

/** Is hardware group is available as a Push popup */
module.exports = function (req, res) {
  models.doors_hardware_groups.find({
    where: {
      id: {
        $ne: req.params.id
      },
      factory_id: req.session.user.factory_id,
      is_push: 1
    }
  }).then(function (hardwareGroup) {
    if (hardwareGroup) {return res.send({
      status: true,
      isAvailable: false,
      message: res.__('Unavailable Push') + ' ' + hardwareGroup.name
    });}

    res.send({ status: true, isAvailable: true });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
}
