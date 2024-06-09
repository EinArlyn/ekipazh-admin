var models = require('../../lib/models');
var validateNewRecords = require('../../lib/services/userHistory').validateNewRecords;

module.exports = function (req, res) {
  var userId = req.params.userId;
  var field = req.body.field;
  var value = req.body.value;
  var update = {};

  update[field] = parseFloat(value);

  models.users.findOne({
    where: {
      id: parseInt(userId)
    }
  }).then(function (user) {
    var oldRow = JSON.stringify(user.dataValues);

    user.updateAttributes(update).then(function() {
      models.users.findOne({
        where: {id: userId}
      }).then(function (changedUser) {
        var newRow = JSON.stringify(changedUser.dataValues);
        validateNewRecords(userId, 'users', oldRow, newRow, req.session.user.id + ' ' + req.session.user.name);
        res.send({ status: true });
      }).catch(function (err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function (err) {
      console.log(err);
      res.send({ status: false });
    });
  }).catch(function (err) {
    console.log(err);
    res.send({ status: false });
  });
}
