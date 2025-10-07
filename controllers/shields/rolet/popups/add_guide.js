var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add guide');
    console.log(fields);

    models.rol_guides.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      is_activ: 1,
      height: parseInt(fields.height, 10) || 0,
      thickness: parseInt(fields.thickness, 10) || 0,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_grid: parseInt(fields.is_grid, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function(newGuide){

      if (!files.rolet_img.name) return res.send({ status: true });

      var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
      loadImage(files.rolet_img.path, imageUrl);

      newGuide.updateAttributes({
        img: imageUrl
      }).then(function (newGuide) {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function(err) {
      res.send({status: false})
    })
    
  });
};
