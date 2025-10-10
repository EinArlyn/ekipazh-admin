var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete lamel');
    console.log(fields);

    models.rol_lamels.findOne({
      where: { id: fields.lamel_id }
    })
    .then(function (lamel) {
      if (!lamel) {
        return res.send({ status: false, error: 'not found' });
      }

      return lamel.destroy()
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
