var models = require('../../../../lib/models');

/**
 * Get additional color by ID
 */
module.exports = function (req, res) {
  var id = req.params.id;

  models.addition_colors.find({
    where: {
      id
    }
  }).then(function (color) {
    res.send({ status: true, color: color });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
