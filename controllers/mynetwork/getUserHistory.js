var models = require('../../lib/models');

/**
 * Get user history
 * @param {integer} userId
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  models.users_histories.findAll({
    where: {user_id: userId},
    order: 'modified DESC'
  }).then(function(histories) {
    res.send({status: true, histories: histories});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  })
}
