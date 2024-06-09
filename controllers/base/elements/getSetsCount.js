var models = require('../../../lib/models');

/**
 * Get sets count of current element
 * @param {integer} params.id - Parent element id
 */
module.exports = function (req, res) {
  var elementId = req.params.id;

  models.lists.findAll({
    where: { parent_element_id: elementId }
  }).then(function (lists) {
    res.send(lists);
  }).catch(function (error) {
    console.log(error);
  });
};
