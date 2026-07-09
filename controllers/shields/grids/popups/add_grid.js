const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
      if (err) {
        console.error('parseForm error:', err);
        return res.send({ status: false });
      }

    console.log('fields', fields);
    models.pls_grids.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        sku: fields.sku,
        price: parseFloat(fields.price) || 0,
        edit_size_w: parseFloat(fields.edit_size_w) || 0,
        edit_size_h: parseFloat(fields.edit_size_h) || 0,
        size_wave: parseFloat(fields.size_wave) || 0,
        weight: parseFloat(fields.weight) || 0,
        currency_id: parseInt(fields.currency_id, 10),
        description: fields.description || '',
        img: '/local_storage/default.png'
    }).then(function(newGrid) {
      if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
        return res.send({ status: true });
      }

      const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
      const maybePromise = loadImage(files.pls_img.path, imageUrl);
      const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
        ? maybePromise
        : Promise.resolve();

      waitLoad.then(function () {
        return newGrid.updateAttributes({
          img: imageUrl
        });
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
      
    }).catch(function(err) {
        console.error('Error creating grid:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
