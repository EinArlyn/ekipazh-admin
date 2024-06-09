var models = require('../../../lib/models');

/**
 * Delete element if it not consist in list
 * @param {integer} body.elementId - Parent element Id
 */
module.exports = function (req, res) {
  var elementId = req.body.elementId;

  models.lists.findAll({
    where: { parent_element_id: elementId }
  }).then(function (result) {
    if (result.length) {
      return res.send({ status: false, err: 'lists' });
    }

    models.elements.findOne({
      where: { id: elementId }
    }).then(function (element) {
      element.destroy().then(function () {
        res.send({ status: true });
      }).catch(function (err) {
        res.send({ status: false, err: 'profile_systems' });
      });
    });
  });
};
