var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit lamel');
    console.log(fields);

    models.rol_lamels.findOne({
      where: { id: fields.lamel_id }
    })
    .then(function (lamel) {
      if (!lamel) {
        return res.send({ status: false, error: 'lamel not found' });
      }

      const end_list  = JSON.parse(fields.end_list  || '[]'); 
      const size_list = JSON.parse(fields.size_list || '[]'); 

      return lamel.updateAttributes({
        name: fields.name,
        position: parseInt(fields.position, 10) || 0,
        height: Number(fields.height) || 0,
        is_color: parseInt(fields.is_color, 10) || 0,
        description: fields.description
      })
      .then(function () {
        // тянем текущие связи параллельно
        return Promise.all([
          models.rol_lamels_end_lists.findAll({
            where: { rol_lamel_id: fields.lamel_id },
            raw: true
          }),
          models.rol_lamels_guides.findAll({
            where: { rol_lamel_id: fields.lamel_id },
            raw: true
          })
        ]);
      })
      .then(function ([lamelEndLists, lamelGuides]) {
        // --- END LISTS: добавить те, которых нет
        const endAddPromises = end_list
          .filter(function (listId) {
            return !lamelEndLists.some(function (row) {
              return Number(row.rol_end_list_id) === Number(listId);
            });
          })
          .map(function (listId) {
            return models.rol_lamels_end_lists.create({
              rol_lamel_id: fields.lamel_id,
              rol_end_list_id: listId
            });
          });

        // --- END LISTS: удалить те, которых больше нет в payload
        const endDelPromises = lamelEndLists
          .filter(function (row) {
            return !end_list.some(function (listId) {
              return Number(listId) === Number(row.rol_end_list_id);
            });
          })
          .map(function (row) {
            return models.rol_lamels_end_lists.destroy({ where: { id: row.id } });
          });

        // --- GUIDES: добавить недостающие
        const sizeAddPromises = size_list
          .filter(function (s) {
            return !lamelGuides.some(function (row) {
              return Number(row.rol_guide_id) === Number(s.id);
            });
          })
          .map(function (s) {
            return models.rol_lamels_guides.create({
              rol_lamel_id: fields.lamel_id,
              rol_guide_id: s.id,
              max_width: s.width,
              max_square: s.square
            });
          });

        // --- GUIDES: удалить лишние
        const sizeDelPromises = lamelGuides
          .filter(function (row) {
            // ВАЖНО: сравниваем с size_list по s.id, а не s.rol_guide_id
            return !size_list.some(function (s) {
              return Number(s.id) === Number(row.rol_guide_id);
            });
          })
          .map(function (row) {
            return models.rol_lamels_guides.destroy({ where: { id: row.id } });
          });

        // --- GUIDES: обновить различающиеся записи
        const sizeUpdatePromises = lamelGuides
          .filter(function (row) {
            return size_list.some(function (s) {
              return Number(s.id) === Number(row.rol_guide_id);
            });
          })
          .map(function (row) {
            const s = size_list.find(function (x) {
              return Number(x.id) === Number(row.rol_guide_id);
            });

            // проверяем, изменились ли значения
            if (Number(row.max_width) !== Number(s.width) || Number(row.max_square) !== Number(s.square)) {
              return models.rol_lamels_guides.update(
                {
                  max_width: s.width,
                  max_square: s.square
                },
                { where: { id: row.id } }
              );
            }

            return Promise.resolve(); // ничего не делаем
          });

        // Ждём выполнение всех операций
        return Promise.all(
          endAddPromises
            .concat(endDelPromises)
            .concat(sizeAddPromises)
            .concat(sizeDelPromises)
            .concat(sizeUpdatePromises)
        );
      });
    })
    .then(function () {
      // если файла нет — просто завершаем успехом, defaut img уже стоит
      if (!(files && files.rolet_img && files.rolet_img.name)) {
        return res.send({ status: true });
      }

      var imageUrl = '/local_storage/rollets/' +
        Math.floor(Math.random() * 1000000) + files.rolet_img.name;

      // если loadImage возвращает промис — дождёмся
      var maybe = loadImage(files.rolet_img.path, imageUrl);
      var waitLoad = (maybe && typeof maybe.then === 'function') ? maybe : Promise.resolve();

      waitLoad
        .then(function () {
          return models.rol_lamels.update(
            { img: imageUrl },
            { where: { id: fields.lamel_id } }
          );
        })
        .then(function () {
          res.send({ status: true });
        })
        .catch(function (e) {
          console.error(e);
          res.send({ status: false });
        });
    })
    .catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });

  });
};
