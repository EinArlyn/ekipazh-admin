var models = require('../../../../lib/models');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader').loadImage;

/**
 * Add additional folder
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.addition_folders.create({
      name: fields.name,
      addition_type_id: parseInt(fields.type_id, 10),
      factory_id: parseInt(req.session.user.factory_id),
      position: fields.position || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: '/local_storage/default.png',
      max_size: parseInt(fields.max_size, 10) || 0
    }).then(function(newGroup) {
      if (!files.folder_img.name) return res.send({ status: true });

      var imageUrl = '/local_storage/addition_folders/' + Math.floor(Math.random() * 1000000) + files.folder_img.name;
      loadImage(files.folder_img.path, imageUrl);

      newGroup.updateAttributes({
        img: imageUrl
      }).then(function (newGroup) {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function (err) {
      console.log(err);
      res.send({ status: false });
    });
  });
};
