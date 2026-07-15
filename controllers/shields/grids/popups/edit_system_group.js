const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_system_groups.findOne({
      where: { id: fields.group_id }
    }).then(function(systemGroup) {
      if (!systemGroup) {
        return res.send({ status: false, message: 'System group not found' });
      }

      return systemGroup.update({
        name: fields.name,
        position: parseInt(fields.position, 10) || 0,
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
          return systemGroup.updateAttributes({ img: imageUrl });
        }).then(function () {
          res.send({ status: true });
        });
      });
    }).catch(function(err) {
      console.error('Error editing system group:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
