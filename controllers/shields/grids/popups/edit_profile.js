var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
   models.pls_profiles.findOne({
      where: {id: fields.profile_id}
    }).then(function(profile) {
      if (profile) {
        profile.update({
          name: fields.name,
          sku: fields.sku,
          type: parseFloat(fields.type) || 0,
          price: parseFloat(fields.price) || 0,
          waste: parseFloat(fields.waste) || 0,
          amendment_pruning: fields.amendment_pruning ? parseFloat(fields.amendment_pruning) : 0,
          weight: fields.weight ? parseFloat(fields.weight) : 0,
          currency_id: parseInt(fields.currency_id, 10),
        }).then(function() {
          res.send({ status: true });
        }).catch(function() {
          res.send({status: false})
        });
      } else {
        res.send({status: false, message: 'Profile not found'});
      }
    });
  });
};
