var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit control');
    console.log(fields);

    if (err) {
      console.error(err);
      return res.send({ status: false });
    }

    const controlId = Number(fields.control_id);

    models.rol_controls.findOne({
      where: { id: controlId }
    })
    .then(function (control) {
      if (!control) {
        return res.send({ status: false });
      }

      return control.update({
        name: fields.name,
        rol_control_group_id: parseInt(fields.group_id, 10),
        position: Number(fields.position) || 0,
        price: Number(fields.price) || 0,
        is_side: parseInt(fields.is_side, 10) || 0,
        description: fields.description
      });
    })
    .then(function () {

      if (!(files && files.rolet_img && files.rolet_img.name)) {
        return res.send({ status: true });
      }

      var imageUrl = '/local_storage/rollets/' +
        Math.floor(Math.random() * 1000000) + '_' + files.rolet_img.name;

      loadImage(files.rolet_img.path, imageUrl);

      return models.rol_controls.update(
        { img: imageUrl },
        { where: { id: controlId } }
      )
      .then(function () {
        res.send({ status: true });
      })
      .catch(function (e) {
        console.error(e);
        res.send({ status: false });
      });

    })
    .catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });

  });
};

