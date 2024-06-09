var models = require('../../lib/models');
var writeHistory = require('../../lib/services/userHistory').writeHistory;

module.exports = function (req, res) {
  var userId = req.params.userId;
  var field = req.body.field;
  var rowId = req.body.rowId;
  var value = req.body.value;

  var update = {};
  update[field] = value;

  models.users_deliveries.findOne({
    where: {id: rowId}
  }).then(function(userDeliveries) {
    var oldValue = userDeliveries[field];
    var newValue = value;

    userDeliveries.updateAttributes(update).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
    writeHistory(userId, 'delivery', field, {old_value: oldValue, new_value: newValue}, req.session.user.id + ' ' + req.session.user.name);
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  })
}
