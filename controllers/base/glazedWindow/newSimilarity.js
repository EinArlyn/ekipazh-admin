var models = require('../../../lib/models');

/**
 * Create new similarity
 */
module.exports = function (req, res) {
  models.similarities.create({
    factory_id: req.session.user.factory_id
  }).then(function (similarity) {
    /**
     * TODO:
     * [1] Sequelize ~3.* provide possibility to get data from new created raw
           i.e. remove extra search
     * [2] Handle status on UI side
     */

    models.similarities.findOne({
      where: { id: similarity.id },
      attributes: ['id']
    }).then(function (similarity) {
      res.send(similarity);
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false, error: error });
    });
  }).catch(function (error) {
    res.send({ status: false, error: error });
  });
};
