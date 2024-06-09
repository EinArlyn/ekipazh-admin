var models = require('../../../../lib/models');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader').loadImage;

/**
 * Edit additional folder by ID
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.addition_folders.find({
      where: {
        id: fields.folder_id
      }
    }).then(function (folder) {
      folder.updateAttributes({
        name: fields.name,
        position: fields.position || 0,
        modified: new Date(),
        link: fields.link,
        description: fields.description,
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
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
};
