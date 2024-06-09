var models = require('../../../lib/models');

/**
 * Get current elements
 * @param {integer} params.groupId
 */
module.exports = function (req, res) {
  var groupId = req.params.groupId;

  models.elements.findAll({
    where: {
      element_group_id: groupId,
      factory_id: req.session.user.factory_id
    }
  }).then(function (elements) {
    res.send(elements);
  }).catch(function (error) {
    console.log(error);
    res.send({
      status: false,
      error: error
    });
  });
};
