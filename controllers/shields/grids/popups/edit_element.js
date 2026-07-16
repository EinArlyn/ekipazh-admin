var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
   models.pls_elements.findOne({
      where: {id: fields.element_id}
    }).then(function(element) {
      if (element) {
        element.update({
          name: fields.name,
          sku: fields.sku,
          currency_id: parseInt(fields.currency_id, 10),
          price: parseFloat(fields.price) || 0,
          unit_type_id: parseInt(fields.unit_type_id || 1, 10),
          color_dependence: parseInt(fields.color_dependence || 0, 10),
          waste: parseFloat(fields.waste) || 0,
          amendment_pruning: fields.amendment_pruning ? parseFloat(fields.amendment_pruning) : 0,
          weight: fields.weight ? parseFloat(fields.weight) : 0,
        }).then(function() {
          res.send({ status: true });
        }).catch(function() {
          res.send({status: false})
        });
      } else {
        res.send({status: false, message: 'Element not found'});
      }
    });
  });
};
