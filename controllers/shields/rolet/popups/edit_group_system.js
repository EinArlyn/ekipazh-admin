var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    // безопасный парс списка стран
    var country_list = [];
    try {
      country_list = JSON.parse(fields.country_list || '[]');
    } catch (e) {
      console.error('Invalid country_list JSON:', fields.country_list);
      return res.send({ status: false });
    }

    var groupId = parseInt(fields.group_id, 10);
    if (!Number.isFinite(groupId)) {
      return res.send({ status: false });
    }

    models.rol_groups.findOne({ where: { id: groupId } })
      .then(function (group) {
        if (!group) return res.send({ status: false });

        // 1) апдейт базовых полей
        return group.update({
          name: fields.name,
          position: parseInt(fields.position, 10) || 0,
          currency_id: parseInt(fields.currency_id, 10) || 0,
          for_type: fields.types,
          description: fields.description
        })
        .then(function (editedGroup) {
          // 2) синхронизация стран: удалить лишние, добавить недостающие
          return models.compliance_rol_groups.findAll({
            where: { rol_group_id: groupId }
          })
          .then(function (countries) {
            // ids из формы и из БД как числа
            var formIds = (country_list || []).map(function (c) { return Number(c.country_id); });
            var dbIds   = (countries || []).map(function (c) { return Number(c.country_id); });

            // toDelete: те, которых нет в форме
            var toDelete = countries.filter(function (c) {
              return !formIds.includes(Number(c.country_id));
            });

            // toCreate: новые id, которых нет в БД
            var toCreate = formIds.filter(function (id) {
              return !dbIds.includes(Number(id));
            });

            var ops = [];

            toDelete.forEach(function (cObj) {
              ops.push(cObj.destroy());
            });

            toCreate.forEach(function (id) {
              ops.push(models.compliance_rol_groups.create({
                rol_group_id: groupId,
                country_id: Number(id)
              }));
            });

            // 3) дождаться синхронизации
            return Promise.all(ops).then(function () {
              // 4) картинка: только если загружен новый файл
              var hasNewImg = files && files.rolet_img && files.rolet_img.name;
              if (!hasNewImg) return null;

              var imageUrl = '/local_storage/rollets/' +
                Math.floor(Math.random() * 1000000) +
                files.rolet_img.name;

              var maybe = loadImage(files.rolet_img.path, imageUrl);
              var waitLoad = (maybe && typeof maybe.then === 'function') ? maybe : Promise.resolve();

              return waitLoad.then(function () {
                return editedGroup.update({ img: imageUrl });
              });
            });
          });
        });
      })
      .then(function () {
        // единый успешный ответ
        res.send({ status: true });
      })
      .catch(function (e) {
        console.error('edit group system error:', e);
        res.send({ status: false });
      });
  });
};
