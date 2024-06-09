var models = require('../../../lib/models');

/**
 * Check if window glass is in similarity
 * @param {integer} query.similarityId - Similarity Id
 * @param {integer} query.profileSystemId - Profile system Id
 * @param {integer} query.elementId - Element Id
 */
module.exports = function (req, res) {
  var similarityId = req.query.similarityId;
  var profileSystemId = req.query.profileSystemId;
  var elementId = req.query.elementId;

  models.glass_similarities.findOne({
    where: {
      similarity_id: similarityId,
      profile_system_id: profileSystemId,
      element_id: elementId
    }
  }).then(function (result) {
    if (result) return res.send({
      exist: true,
      id: result.id
    });

    res.send({ exist: false });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
