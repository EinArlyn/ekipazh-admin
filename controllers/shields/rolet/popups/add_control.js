var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add control');
    console.log(fields);

    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    models.rol_controls.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      position: Number(fields.position) || 0,
      price: Number(fields.price) || 0,
      is_activ: 1,
      is_standart: 0,
      description: fields.description,
      img: '/local_storage/default.png'
    })
    .then(function (newControl) {

      var file = files && files.rolet_img;

      if (!file || !file.name) {
        return res.send({ status: true });
      }

      var imageUrl = '/local_storage/rollets/' +
        Math.floor(Math.random() * 1000000) + '_' + file.name;

      loadImage(file.path, imageUrl);

      return newControl.updateAttributes({
        img: imageUrl
      })
      .then(function () {
        res.send({ status: true });
      });
    })
    .catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });

  });
};
