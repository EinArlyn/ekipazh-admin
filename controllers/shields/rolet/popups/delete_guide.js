var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete guide');
    console.log(fields);
    models.rol_guides.destroy({
      where: {id: fields.guide_id}
    }).then(function(){
      res.send({ status: true });
    }).catch(function(err){
      res.send({ status: false })
    })
  });
};
