var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_links.findOne({
      where: {id: fields.link_id}
    }).then(function(linkElement) {
      if (linkElement) {
        linkElement.update({
          element_id: parseFloat(fields.element_id),
          rules_id: parseFloat(fields.rules_id),
          rules_value: parseFloat(fields.rules_value, 10),
        }).then(function() {
          res.send({ status: true });
        }).catch(function() {
          res.send({status: false})
        });
      } else {
        res.send({status: false, message: 'Link element not found'});
      }
    });
  });
};
