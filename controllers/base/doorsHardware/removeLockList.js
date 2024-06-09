'use strict';

var models = require('../../../lib/models');

/**
 * Remove lock list dependency
 */
module.exports = function (req, res) {
  var id = req.body.lockListId;

  models.lock_lists.destroy({
    where: {
      id: id
    }
  }).then(function () {
    res.send({ status: true });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
