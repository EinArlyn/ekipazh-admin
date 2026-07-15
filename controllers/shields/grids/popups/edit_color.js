const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_profile_colors.findOne({
      where: { id: fields.color_id }
    }).then(function(color) {
      if (!color) {
        return res.send({ status: false, message: 'Color not found' });
      }

      return color.update({
        name: fields.name,
        sku: fields.sku,
        position: parseInt(fields.position, 10) || 0,
        price: Number(fields.price) || 0,
      }).then(function () {
        if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
          return res.send({ status: true });
        }

        const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
        const maybePromise = loadImage(files.pls_img.path, imageUrl);
        const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
          ? maybePromise
          : Promise.resolve();

        return waitLoad.then(function () {
          return color.updateAttributes({ img: imageUrl });
        }).then(function () {
          res.send({ status: true });
        });
      });
    }).catch(function(err) {
      console.error('Error editing color:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
