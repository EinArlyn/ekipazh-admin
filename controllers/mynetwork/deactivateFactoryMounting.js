var models = require('../../lib/models');

/**
 * Deactivate factory mounting
 * @param {integer} userId
 * @param {integer} mountingId
 */
module.exports = function (req, res) {
  var userId = req.params.userId;
  var mountingId = req.body.mountingId;
  var isChecked = req.body.isChecked;

  if (isChecked === 'false') {
    models.deactivated_mountings.create({
      user_id: parseInt(userId),
      mounting_id: parseInt(mountingId)
    }).then(function() {
      res.send({ status: true });
    }).catch(function(err) {
      console.log(err);
      res.send({ status: false });
    });
  } else {
    models.deactivated_mountings.findOne({
      where: {
        user_id: parseInt(userId, 10),
        mounting_id: parseInt(mountingId, 10)
      }
    }).then(function(deactivatedMounting) {
      deactivatedMounting.destroy().then(function() {
        res.send({ status: true });
      }).catch(function(err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function(err) {
      console.log(err);
      res.send({ status: false });
    });
  }
}
