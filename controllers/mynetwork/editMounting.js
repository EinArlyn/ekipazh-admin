var models = require('../../lib/models');
var writeHistory = require('../../lib/services/userHistory').writeHistory;

module.exports = function (req, res) {
  var userId = req.params.userId;
  var field = req.body.field;
  var rowId = req.body.rowId;
  var value = req.body.value;

  var update = {};
  update[field] = value;

  models.users_mountings.findOne({
    where: {id: rowId}
  }).then(function(userMountings) {
    var oldValue = userMountings[field];
    var newValue = value;
    userMountings.updateAttributes(update).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
    writeHistory(userId, 'mounting', field, {old_value: oldValue, new_value: newValue}, req.session.user.id + ' ' + req.session.user.name);
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
