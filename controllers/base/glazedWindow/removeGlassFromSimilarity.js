var models = require('../../../lib/models');

/**
 * Remove window glass from similarity
 * @param {integer} body.similarityId - Similarity Id
 * @param {integer} body.profileId - Profile system Id
 */
// TODO: Handle response status in UI side
module.exports = function (req, res) {
  models.glass_similarities.findOne({
    where: {
      similarity_id: parseInt(req.body.similarityId, 10),
      profile_system_id: parseInt(req.body.profileId, 10)
    }
  }).then(function (glass) {
    glass.destroy().then(function() {
      res.end();
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};
