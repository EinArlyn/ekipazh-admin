'use strict';

var models = require('../../../lib/models');

/**
 * Get lock lists dependency
 */
module.exports = function (req, res) {
  var groupId = req.params.hardwareGroupId;

  models.lock_lists.findAll({
    where: {
      group_id: groupId
    },
    include: [{
      model: models.lists
    }]
  }).then(function (lockLists) {
    res.send({
      status: true,
      lockLists: lockLists
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
