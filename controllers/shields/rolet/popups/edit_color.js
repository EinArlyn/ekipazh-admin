var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;


module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_colors.findOne({
      where: {id: fields.color_id}
    }).then(function(color) {
      if (color) {
        color.updateAttributes({
          name: fields.name,
          position: parseInt(fields.position, 10),
        }).then(function(newColor) {
          if (!files.rolet_img.name) return res.send({ status: true });

          var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
          loadImage(files.rolet_img.path, imageUrl);

          newColor.updateAttributes({
            img: imageUrl
          }).then(function (newColor) {
            res.send({ status: true });
          }).catch(function (error) {
            console.log(error);
            res.send({ status: false });
          });
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
};


