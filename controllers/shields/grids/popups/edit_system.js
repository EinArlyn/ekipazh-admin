const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;
const loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_systems.findOne({
      where: { id: fields.system_id }
    }).then(function(system) {
      if (!system) {
        return res.send({ status: false, message: 'System not found' });
      }

      return system.update({
        name: fields.name,
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
      }).then(function () {
        const gridLinks = JSON.parse(fields.grid_links || '[]');

        const syncLinksPromise = models.pls_system_grid_links.findAll({
          where: { system_id: fields.system_id }
        }).then(function (existingLinks) {
          const incomingGridIds = gridLinks.map(function (id) {
            return parseInt(id, 10);
          });

          const existingGridIds = existingLinks.map(function (link) {
            return link.grid_id;
          });

          const gridIdsToCreate = incomingGridIds.filter(function (gridId) {
            return existingGridIds.indexOf(gridId) === -1;
          });

          const linksToDelete = existingLinks.filter(function (link) {
            return incomingGridIds.indexOf(link.grid_id) === -1;
          });

          const createPromises = gridIdsToCreate.map(function (gridId) {
            return models.pls_system_grid_links.create({
              system_id: fields.system_id,
              grid_id: gridId
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
          return system.updateAttributes({ img: imageUrl });
        }).then(function () {
          res.send({ status: true });
        });
      });
    }).catch(function(err) {
      console.error('Error editing system:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
