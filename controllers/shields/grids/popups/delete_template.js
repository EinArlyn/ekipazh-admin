var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_templates.findOne({
      where: {id: fields.template_id}
    }).then(function(template) {
      models.pls_template_system_links.destroy({
        where: { template_id: fields.template_id }
      }).then(function() {
        if (template) {
            template.destroy().then(function() {
              res.send({ status: true });
          }).catch(function() {
            res.send({status: false});
          });
        } else {
          res.send({status: false, message: 'Template not found'});
        }
      });
    });
  });
};
