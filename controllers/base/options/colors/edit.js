var models = require('../../../../lib/models');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader').loadImage;

/**
 * Edit additional color by ID
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.addition_colors.find({
      where: {
        id: fields.color_id
      }
    }).then(function (color) {
      color.updateAttributes({
        name: fields.name,
        modified: new Date(),
      }).then(function(editColor) {
        if (!files.color_img.name) return res.send({ status: true });

        var imageUrl = '/local_storage/addition_colors/' + Math.floor(Math.random() * 1000000) + files.color_img.name;
        loadImage(files.color_img.path, imageUrl);

        editColor.updateAttributes({
          img: imageUrl
        }).then(function (editColor) {
          res.send({ status: true });
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }).catch(function (err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
};
