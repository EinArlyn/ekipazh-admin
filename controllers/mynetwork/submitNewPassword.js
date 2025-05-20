var models = require('../../lib/models');
var parseForm = require('../../lib/services/formParser.js').parseForm;
var md5 = require('md5');

/**
 * Edit user's password
 * @param {integer} userId
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    if (err) return res.send({ status: false });

    models.users.find({
      where: {
        id: fields.user_id,
        password: md5(fields.old_password)
      }
    }).then(function (user) {
      if (!user) return res.send({ status: false });

      if (fields.new_password !== fields.new_password_repeat) return res.send({ status: false });

      user.updateAttributes({
        password: md5(fields.new_password),
        password_updated_at: Date.now()
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
};
