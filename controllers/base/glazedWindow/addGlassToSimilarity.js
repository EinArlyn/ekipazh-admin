var models = require('../../../lib/models');

/**
 * Add glass to similarity
 * @param {integer} body.similarityId - Similarity Id
 * @param {integer} body.profileId - Profile system Id
 */
module.exports = function (req, res) {
  models.glass_similarities.findOne({
    where: {
      similarity_id: parseInt(req.body.similarityId, 10),
      profile_system_id: parseInt(req.body.profileId, 10)
    }
  }).then(function (result) {
    if (result) {
      result.updateAttributes({
        element_id: parseInt(req.body.glassId, 10)
      });
    } else {
      models.glass_similarities.create({
        similarity_id: parseInt(req.body.similarityId, 10),
        profile_system_id: parseInt(req.body.profileId, 10),
        element_id: parseInt(req.body.glassId, 10)
      });
    }
    res.end();
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
};
