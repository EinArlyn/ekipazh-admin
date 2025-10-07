var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add group system');
    console.log(fields);

    models.rol_groups.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      is_activ: 1,
      position: parseInt(fields.position, 10),
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function(newGroup) {

      if (!files.rolet_img.name) return res.send({ status: true });

      var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
      loadImage(files.rolet_img.path, imageUrl);

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
