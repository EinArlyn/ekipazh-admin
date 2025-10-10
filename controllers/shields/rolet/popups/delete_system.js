var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;


module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete system');
    console.log(fields);
    const box_id = fields.system_id;
    models.rol_box_sizes.destroy({
      where: {id_rol_box: box_id}
    }).then(function() {
      models.rol_boxes.destroy({
        where: {id: box_id}
      }).then(function() {
        res.send({ status: true });
      })
    });
    
  });
};
