var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    var parentTypeId = parseInt(fields.parent_type_id, 10);

    console.log('fields', fields);
    models.pls_links.create({
        parent_id: parseInt(fields.parent_id, 10),
        element_id: parseInt(fields.element_id, 10),
        rules_id: parseInt(fields.rules_id, 10),
        rules_value: parseFloat(fields.rules_value),
        parent_type_id: parentTypeId
    }).then(function(newLinkElement) {
      if (newLinkElement) {
        res.send({status: true});
      } else {
        res.send({status: false, message: 'Link element not created'});
      }
    }).catch(function(err) {
        console.error('Error creating link element:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
