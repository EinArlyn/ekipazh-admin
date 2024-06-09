var models = require('../../../lib/models');

/**
 * Get glass for relevant profile system
 * @param {integer} param.id - Profile system Id
 */
module.exports = function (req, res) {
  models.elements_profile_systems.findAll({
    where: {
      profile_system_id: req.params.id
    },
    include: [{
      model: models.elements,
      where: {
        element_group_id: 8
      }
    }],
    attributes: ['profile_system_id', 'element_id']
  }).then(function (glasses) {
    res.send(glasses);
  });
};
