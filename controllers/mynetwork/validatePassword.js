var models = require('../../lib/models');
var md5 = require('md5');

/**
 * Validate user's password
 * @param {integer} userId
 */
module.exports = function (req, res) {
  models.users.find({
    where: {
      id: req.body.id,
      password: md5(req.body.password)
    }
  }).then(function (user) {
    if (!user) return res.send({ status: false });

    res.send({ status: true });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
