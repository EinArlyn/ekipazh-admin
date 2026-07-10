const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_grids.findOne({
      where: { id: fields.grid_id }
    }).then(function(grid) {
      if (!grid) {
        return res.send({ status: false, message: 'Grid not found' });
      }

      return grid.update({
        name: fields.name,
        sku: fields.sku,
        price: parseFloat(fields.price) || 0,
        size_wave: parseFloat(fields.size_wave) || 0,
        weight: parseFloat(fields.weight) || 0,
        currency_id: parseInt(fields.currency_id, 10),
        description: fields.description || ''
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
          return grid.updateAttributes({ img: imageUrl });
        }).then(function () {
          res.send({ status: true });
        });
      });
    }).catch(function(err) {
      console.error('Error editing grid:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
