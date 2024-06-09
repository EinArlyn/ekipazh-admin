var models = require('../../lib/models');
var writeHistory = require('../../lib/services/userHistory').writeHistory;

module.exports = function (req, res) {
  var userId = parseInt(req.params.userId);
  var isChecked = req.body.isChecked;
  var paramName = req.body.paramName;

  var update = {};

  if (paramName !== 'is_employee') {
    if (isChecked === 'true') {
      update[paramName] = 1;
    } else {
      update[paramName] = 0;
    }
  } else {
    if (isChecked !== 'true') {
      update[paramName] = 1;
    } else {
      update[paramName] = 0;
    }
  }

  models.users.findOne({
    where: {id: userId}
  }).then(function(user) {
    user.updateAttributes(update).then(function() {
      writeHistory(userId, 'add_params', paramName, {new_value: update[paramName]}, req.session.user.id + ' ' + req.session.user.name);
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
