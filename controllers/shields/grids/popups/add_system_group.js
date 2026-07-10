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
    models.pls_system_groups.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        position: parseInt(fields.position, 10) || 0,
        is_active: 1,
        description: fields.description || '',
        img: '/local_storage/default.png'
    }).then(function(newSystemGroup) {
      if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
        return res.send({ status: true });
      }

      const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
      const maybePromise = loadImage(files.pls_img.path, imageUrl);
      const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
        ? maybePromise
        : Promise.resolve();

      waitLoad.then(function () {
        return newSystemGroup.updateAttributes({
          img: imageUrl
        });
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
      
    }).catch(function(err) {
        console.error('Error creating system group:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
