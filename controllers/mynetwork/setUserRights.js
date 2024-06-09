var models = require('../../lib/models');
var writeHistory = require('../../lib/services/userHistory').writeHistory;

module.exports = function (req, res) {
  var userId = parseInt(req.params.userId);
  var isChecked = req.body.isChecked;
  var menuId = parseInt(req.body.menuId);

  models.users_accesses.findOne({
    where: {user_id: userId, menu_id: menuId}
  }).then(function(access) {
    if (isChecked === 'true') {
      if (access) {
        console.log('Access is already exist for: ' + userId + '. Menu id: ' + menuId);
        res.send({status: true});
      } else {
        models.users_accesses.create({
          user_id: parseInt(userId),
          menu_id: parseInt(menuId),
          position: parseInt(menuId),
          modified: new Date()
        }).then(function() {
          writeHistory(userId, 'rights', menuId, {new_value: 1}, req.session.user.id + ' ' + req.session.user.name);
          res.send({status: true});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        })
      }
    } else {
      if (access) {
        access.destroy().then(function() {
          writeHistory(userId, 'rights', menuId, {new_value: 0}, req.session.user.id + ' ' + req.session.user.name);
          console.log('Destroy access for: ' + userId + '. Menu id: ' + menuId);
          res.send({status: true});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      } else {
        console.log('Access is already destroyed for: ' + userId + '. Menu id: ' + menuId);
        res.send({status: true});
      }
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  })
}
