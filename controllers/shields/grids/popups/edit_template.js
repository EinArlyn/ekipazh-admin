const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_templates.findOne({
      where: { id: fields.template_id }
    }).then(function(template) {
      if (!template) {
        return res.send({ status: false, message: 'Template not found' });
      }

      return template.update({
        name: fields.name,
        open_type: fields.open_type || '',
        direction: fields.direction || '',
        position: parseInt(fields.position, 10) || 0,
        default_w: parseInt(fields.default_w, 10) || 0,
        default_h: parseInt(fields.default_h, 10) || 0,
        work_price: Number(fields.work_price) || 0,
        currency_id: parseInt(fields.currency_id, 10),
      }).then(function () {
        const systemLinks = JSON.parse(fields.system_links || '[]');

        const syncLinksPromise = models.pls_template_system_links.findAll({
          where: { template_id: fields.template_id }
        }).then(function (existingLinks) {
          const incomingSystemIds = systemLinks.map(function (id) {
            return parseInt(id, 10);
          });

          const existingSystemIds = existingLinks.map(function (link) {
            return link.system_id;
          });

          const systemIdsToCreate = incomingSystemIds.filter(function (systemId) {
            return existingSystemIds.indexOf(systemId) === -1;
          });

          const linksToDelete = existingLinks.filter(function (link) {
            return incomingSystemIds.indexOf(link.system_id) === -1;
          });

          const createPromises = systemIdsToCreate.map(function (systemId) {
            return models.pls_template_system_links.create({
              template_id: fields.template_id,
              system_id: systemId
            });
          });

          const deletePromises = linksToDelete.map(function (link) {
            return link.destroy();
          });

          return Promise.all(createPromises.concat(deletePromises));
        });

        if (!(files && files.pls_img && files.pls_img.name && files.pls_img.path)) {
          return syncLinksPromise.then(function () {
            res.send({ status: true });
          });
        }

        const imageUrl = '/local_storage/pls_grid/' + Math.floor(Math.random() * 1000000) + files.pls_img.name;
        const maybePromise = loadImage(files.pls_img.path, imageUrl);
        const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
          ? maybePromise
          : Promise.resolve();

        return Promise.all([syncLinksPromise, waitLoad]).then(function () {
          return template.updateAttributes({ img: imageUrl });
        }).then(function () {
          res.send({ status: true });
        });
      });
    }).catch(function(err) {
      console.error('Error editing template:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
