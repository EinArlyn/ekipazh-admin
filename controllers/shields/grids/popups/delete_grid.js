var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
// var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    models.pls_grids.findOne({
      where: {id: fields.grid_id}
    }).then(function(grid) {
      if (grid) {
        models.pls_links.destroy({
          where: { parent_id: fields.grid_id, parent_type_id: 2 }
        }).then(function() {
          grid.destroy().then(function() {
            res.send({ status: true });
          }).catch(function() {
            res.send({status: false})
          });
        }).catch(function() {
          res.send({status: false});
        });
      } else {
        res.send({status: false, message: 'Grid not found'});
      }
    });
  });
};
