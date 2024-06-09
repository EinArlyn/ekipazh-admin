var models = require('../../../lib/models');

/**
 * Get similarities for profile systems
 */
// TODO: Handle status on UI side.
module.exports = function (req, res) {
  models.similarities.findAll({
    where: { factory_id: req.session.user.factory_id }
  }).then(function (similarities) {
    res.send(similarities);
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
