var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_color_groups.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        is_standart: 0,
        position: parseInt(fields.position, 10) || 0,
        img: fields.colorGroup
    }).then(function(newColorGroup){
        res.send({ status: true });
    }).catch(function(err) {
        res.send({status: false})
    })
  });
};
