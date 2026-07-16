var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    console.log('fields', fields);
    models.pls_elements.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        sku: fields.sku,
        currency_id: parseInt(fields.currency_id, 10),
        price: parseFloat(fields.price) || 0,
        unit_type_id: parseInt(fields.unit_type_id || 1, 10),
        color_dependence: parseInt(fields.color_dependence || 0, 10),
        waste: parseFloat(fields.waste) || 0,
        amendment_pruning: fields.amendment_pruning ? parseFloat(fields.amendment_pruning) : 0,
        weight: fields.weight ? parseFloat(fields.weight) : 0,
    }).then(function(newElement) {
      if (newElement) {
        res.send({status: true});
      } else {
        res.send({status: false, message: 'Element not created'});
      }
    }).catch(function(err) {
        console.error('Error creating element:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
