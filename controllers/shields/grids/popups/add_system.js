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
    models.pls_systems.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        group_id: parseInt(fields.group_id, 10),
        name: fields.name,
        is_active: 1,
        position: parseInt(fields.position, 10) || 0,
        top_id: parseInt(fields.top_id, 10) || 0,
        right_id: parseInt(fields.right_id, 10) || 0,
        bottom_id: parseInt(fields.bottom_id, 10) || 0,
        left_id: parseInt(fields.left_id, 10) || 0,
        center_id: parseInt(fields.center_id, 10) || 0,
        sash_id: parseInt(fields.sash_id, 10) || 0,
        min_w: Number(fields.min_w) || 0,
        max_w: Number(fields.max_w) || 0,
        min_h: Number(fields.min_h) || 0,
        max_h: Number(fields.max_h) || 0,
        edit_grid_w: Number(fields.edit_grid_w) || 0,
        edit_grid_h: Number(fields.edit_grid_h) || 0,
        sash_reduction: Number(fields.sash_reduction) || 0,
        description: fields.description || '',
        img: '/local_storage/default.png'
    }).then(function(newSystem) {
      if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
        return res.send({ status: true });
      }

      const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
      const maybePromise = loadImage(files.pls_img.path, imageUrl);
      const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
        ? maybePromise
        : Promise.resolve();

      waitLoad.then(function () {
        return newSystem.updateAttributes({
          img: imageUrl
        });
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
      
    }).catch(function(err) {
        console.error('Error creating system:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
