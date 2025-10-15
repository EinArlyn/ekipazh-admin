var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Add system');
    console.log(fields);

    models.rol_boxes.create({
      name: fields.name,
      rol_group_id: parseInt(fields.group_id, 10),
      is_activ: 1,
      position: parseInt(fields.position, 10) || 0,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_split: parseInt(fields.is_split, 10) || 0,
      is_grid: parseInt(fields.is_grid, 10) || 0,
      is_security: parseInt(fields.is_security, 10) || 0,
      is_revision: parseInt(fields.is_revision, 10) || 0,
      is_engine: parseInt(fields.is_engine, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    })
    .then(function (newSystem) {
      const size_list = JSON.parse(fields.size_list || '[]');

      const sizePromises = size_list.map(function (size) {
        return models.rol_box_sizes.create({
          id_rol_box: newSystem.id,
          height: size.height,
          width: size.width
        });
      });

      // ждем все размеры (даже если массив пустой)
      return Promise.all(sizePromises)
        .then(function () {
          // если файла нет — на этом всё
          if (!(files && files.rolet_img && files.rolet_img.name)) {
            return 'no-image';
          }

          const imageUrl =
            '/local_storage/rollets/' +
            Math.floor(Math.random() * 1000000) +
            files.rolet_img.name;

          // если loadImage возвращает промис — подождем; если нет — просто идем дальше
          const maybePromise = loadImage(files.rolet_img.path, imageUrl);
          const waitLoad = (maybePromise && typeof maybePromise.then === 'function')
            ? maybePromise
            : Promise.resolve();

          return waitLoad.then(function () {
            // updateAttributes устаревший, но оставляю как у тебя
            return newSystem.updateAttributes({ img: imageUrl });
          });
        });
    })
    .then(function () {
      // сюда попадем и при 'no-image', и после апдейта img
      res.send({ status: true });
    })
    .catch(function (error) {
      console.error(error);
      res.send({ status: false });
    });
  });
};

