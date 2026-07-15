var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_system_groups.findOne({
      where: {id: fields.group_id}
    }).then(function(systemGroup) {
      if (systemGroup) {
        models.pls_systems.destroy({
          where: { group_id: fields.group_id }
        }).then(function() {
          systemGroup.destroy().then(function() {
            res.send({ status: true });
          }).catch(function() {
            res.send({status: false});
          });
        }).catch(function() {
          res.send({status: false});
        });
      } else {
        res.send({status: false, message: 'System group not found'});
      }
    });
  });
};
