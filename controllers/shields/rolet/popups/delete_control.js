var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete control');
    console.log(fields);

    models.rol_controls.findOne({
      where: { id: fields.control_id }
    })
    .then(function (control) {
      if (!control) {
        return res.send({ status: false, error: 'not found' });
      }

      return control.destroy()
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
