var models    = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Edit group Controls');
    console.log(fields);

    var groupId = Number(fields.group_id);

    models.rol_control_groups.findOne({
      where: { id: groupId }
    })
    .then(function (group) {
      if (!group) {
        return res.send({ status: false });
      }

      // 1) обновляем базовые поля
      return group.update({
        name: fields.name,
        position: Number(fields.position) || 0,
        description: fields.description
      })
      .then(function () {

        // 2) если новой картинки нет – просто успех
        if (!(files && files.rolet_img && files.rolet_img.name)) {
          return res.send({ status: true });
        }

        // 3) генерим путь к картинке
        var imageUrl = '/local_storage/rollets/' +
          Math.floor(Math.random() * 1000000) + '_' +
          files.rolet_img.name;

        // 4) грузим файл (не ждём промис, как ты хотел в прошлый раз)
        loadImage(files.rolet_img.path, imageUrl);

        // 5) апдейтим только путь к картинке
        return models.rol_control_groups.update(
          { img: imageUrl },
          { where: { id: groupId } }
        )
        .then(function () {
          res.send({ status: true });
        });
      });
    })
    .catch(function (e) {
      console.error('edit group controls error:', e);
      res.send({ status: false });
    });
  });
};
