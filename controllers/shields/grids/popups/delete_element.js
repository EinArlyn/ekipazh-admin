var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_elements.findOne({
      where: {id: fields.element_id}
    }).then(function(element) {
      if (element) {
        element.destroy().then(function() {
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
