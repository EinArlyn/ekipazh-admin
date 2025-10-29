var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_colors.destroy({
      where: {id: fields.color_id}
    }).then(function(){
      res.send({ status: true });
    }).catch(function(err){
      res.send({ status: false })
    })
    
  });
};
