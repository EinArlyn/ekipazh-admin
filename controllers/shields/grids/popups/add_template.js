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
    models.pls_templates.create({
        name: fields.name,
        is_active: 1,
        construction_type: fields.group_id || '',
        open_type: fields.open_type || '',
        direction: fields.direction || '',
        position: parseInt(fields.position, 10) || 0,
        default_w: parseInt(fields.default_w, 10) || 0,
        default_h: parseInt(fields.default_h, 10) || 0,
        work_price: Number(fields.work_price) || 0,
        img: '/local_storage/default.png'
    }).then(function(newTemplate) {
      const systemLinks = JSON.parse(fields.system_links || '[]');
      const createLinksPromise = Promise.all(systemLinks.map(function (systemId) {
        return models.pls_template_system_links.create({
          template_id: newTemplate.id,
          system_id: systemId
        });
      }));

      if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
        return createLinksPromise.then(function () {
          res.send({ status: true });
        });
      }

      const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
      const maybePromise = loadImage(files.pls_img.path, imageUrl);
      const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
        ? maybePromise
        : Promise.resolve();

      return Promise.all([createLinksPromise, waitLoad]).then(function () {
        return newTemplate.updateAttributes({
          img: imageUrl
        });
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
      
    }).catch(function(err) {
        console.error('Error creating template:', err.message);
        res.send({ status: false, message: err.message });
    });
  })
};
