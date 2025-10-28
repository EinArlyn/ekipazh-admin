var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;


module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Edit system');
    console.log(fields);

    models.rol_boxes.findOne({ where: { id: fields.system_id } })
      .then(function (system) {
        if (!system) return res.send({ status: false });

        // 1️⃣ обновляем основные поля системы
        return system.update({
          name: fields.name,
          rol_group_id: parseInt(fields.group_id, 10),
          position: parseInt(fields.position, 10) || 0,
          is_color: parseInt(fields.is_color, 10) || 0,
          is_split: parseInt(fields.is_split, 10) || 1,
          is_grid: parseInt(fields.is_grid, 10) || 0,
          is_security: parseInt(fields.is_security, 10) || 0,
          is_revision: parseInt(fields.is_revision, 10) || 0,
          is_engine: parseInt(fields.is_engine, 10) || 0,
          split_price: parseInt(fields.split_price, 10) || 0,
          description: fields.description
        })
        .then(function () {
          // 2️⃣ обрабатываем размеры
          let size_list = [];
          try {
            size_list = JSON.parse(fields.size_list || '[]');
          } catch (e) {
            console.error('Invalid size_list JSON:', fields.size_list);
            return Promise.reject(e);
          }

          return models.rol_box_sizes.findAll({
            where: { id_rol_box: fields.system_id }
          })
          .then(function (dataSizes) {
            // --- обновляем и удаляем существующие ---
            const ops1 = dataSizes.map(function (row) {
              const match = size_list.find(s => Number(s.id) === Number(row.id));

              if (!match) {
                // строки нет — удаляем
                return row.destroy();
              }

              const h = Number(match.height) || 0;
              const w = Number(match.width) || 0;
              const p = Number(match.box_price) || 0;

              if (Number(row.height) !== h || Number(row.width) !== w || Number(row.box_price) !== p) {
                return row.update({ height: h, width: w, box_price: p });
              }

              return null; // совпадает — не трогаем
            }).filter(Boolean);

            // --- добавляем новые ---
            const existingIds = dataSizes.map(r => Number(r.id));
            const ops2 = [];

            size_list.forEach(function (size) {
              const sizeId = Number(size.id) || 0;
              const alreadyExists = existingIds.includes(sizeId);

              if (!sizeId || !alreadyExists) {
                ops2.push(
                  models.rol_box_sizes.create({
                    id_rol_box: fields.system_id,
                    height: Number(size.height) || 0,
                    width: Number(size.width) || 0,
                    box_price: Number(size.box_price) || 0
                  })
                );
              }
            });

           

            // ждём всё разом
            return Promise.all(ops1.concat(ops2));
          })
          .then(function () {
            // 3️⃣ если есть новый файл — обновляем картинку
            const hasNewImg = files && files.rolet_img && files.rolet_img.name;
            if (!hasNewImg) return; // нет нового файла — выходим спокойно

            const imageUrl =
              '/local_storage/rollets/' +
              Math.floor(Math.random() * 1000000) +
              files.rolet_img.name;

            const maybe = loadImage(files.rolet_img.path, imageUrl);
            const waitLoad = (maybe && typeof maybe.then === 'function') ? maybe : Promise.resolve();

            return waitLoad.then(function () {
              if (system.img !== imageUrl) {
                return system.update({ img: imageUrl });
              }
            });
          });
        });
      })
      .then(function () {
        res.send({ status: true });
      })
      .catch(function (e) {
        console.error('Edit system error:', e);
        res.send({ status: false });
      });
  });
};


