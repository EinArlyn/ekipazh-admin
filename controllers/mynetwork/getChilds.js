var async = require('async');
var models = require('../../lib/models');
var getIncludedUsers = require('../../lib/services/helpers').getIncludedUsers;

// TODO: Separate service????
module.exports = function (req, res) {
  var userId = req.params.parentId;
  var _from = (req.query.from ? (req.query.from.split('.')[2] + '-' + req.query.from.split('.')[1] + '-' + req.query.from.split('.')[0]) : new Date(req.session.user.created_at).getFullYear() + '-' + (("0" + (new Date(req.session.user.created_at).getMonth() + 1)).slice(-2)) + '-' + ("0" + new Date(req.session.user.created_at).getDate()).slice(-2));
  var _to = (req.query.to ? (req.query.to.split('.')[2] + '-' + req.query.to.split('.')[1] + '-' + req.query.to.split('.')[0]) : new Date().getFullYear() + '-' + (("0" + (new Date().getMonth() + 1)).slice(-2)) + '-' + ("0" + new Date().getDate()).slice(-2));
  var lights = (req.query.lights ? req.query.lights : '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13');

  async.waterfall([
    function (_callback) {
      var includedUsers = getIncludedUsers(parseInt(userId, 10), _from, _to, lights, 2, 3);

      setTimeout(function () {
        _callback(null, includedUsers);
      }, 500);
    }
  ], function (err, result) {
    if (err) return res.send({ status: false });

    res.send({ status: true, users: result });
  });
};
