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
    models.lamination_factory_colors.findAll({}).then(function(laminations){
      laminations.sort((a, b) => a.name.localeCompare(b.name));
      res.send({ status: true, color: color, laminations: laminations });
    })
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
