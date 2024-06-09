var models = require('../../lib/models');

module.exports = function (req, res) {
  var userId = parseInt(req.params.userId);
  var isChecked = req.body.isChecked;
  var rowId = req.body.rowId;
  var update = {};

  if (isChecked === 'true') {
    update['active'] = 1;
  } else {
    update['active'] = 0;
  }

  models.users_deliveries.findOne({
    where: {id: rowId}
  }).then(function(userDeliveries) {
    userDeliveries.updateAttributes(update).then(function() {
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
