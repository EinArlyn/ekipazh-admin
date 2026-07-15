var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_profiles.findOne({
      where: {id: fields.profile_id}
    }).then(function(profile) {
      if (profile) {
        models.pls_links.destroy({
          where: { parent_id: fields.profile_id, parent_type_id: 1 }
        }).then(function() {
          profile.destroy().then(function() {
            res.send({ status: true });
          }).catch(function() {
            res.send({status: false})
          });
        }).catch(function() {
          res.send({status: false});
        });
      } else {
        res.send({status: false, message: 'Profile not found'});
      }
    });
  });
};
