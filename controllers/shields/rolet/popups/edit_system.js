var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;


// module.exports = function (req, res) {
//   parseForm(req, function (err, fields, files) {
//     console.log('>>>>>>>>>>>>>>>>>>>>>Edit system');
//     console.log(fields);

//     models.rol_boxes.findOne({
//       where: {id: fields.system_id}
//     }).then(function(system) {
//       system.updateAttributes({
//         name: fields.name,
//         rol_group_id: parseInt(fields.group_id, 10),
//         position: parseInt(fields.position, 10) || 0,
//         is_color: parseInt(fields.is_color, 10) || 0,
//         is_split: parseInt(fields.is_split, 10) || 0,
//         is_grid: parseInt(fields.is_grid, 10) || 0,
//         is_security: parseInt(fields.is_security, 10) || 0,
//         is_revision: parseInt(fields.is_revision, 10) || 0,
//         is_engine: parseInt(fields.is_engine, 10) || 0,
//         description: fields.description
//       })

//       let heights = Object.keys(fields)          
//         .filter(key => key.startsWith('height_'))
//         .map(key => fields[key])                    
//         .map(Number);  
//       let width = Object.keys(fields)          
//         .filter(key => key.startsWith('width_'))
//         .map(key => fields[key])                    
//         .map(Number);  

//       const size_ids = (fields.size_ids || '')
//       .split(',')               // разбиваем строку по запятой
//       .map(id => parseInt(id, 10)) // превращаем в числа
//       .filter(Number.isFinite);

//       heights.forEach((height, index) => {
//         if (parseInt(height, 10) > 0 && size_ids[index]) {
//           models.rol_box_sizes.findOne({
//             where: {id: size_ids[index]}
//           }).then(function(row) {
//             row.updateAttributes({
//               height: height,
//               width: width[index]
//             })
//           })    
//         } else if (parseInt(height, 10) > 0 && !size_ids[index]) {
//           models.rol_box_sizes.create({
//             id_rol_box: fields.system_id,
//             height: height,
//             width: width[index]
//           })
//         }
//       })


//       if (!files.rolet_img.name) return res.send({ status: true });

//       var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
//       loadImage(files.rolet_img.path, imageUrl);

//       system.updateAttributes({
//         img: imageUrl
//       }).then(function (system) {
//         res.send({ status: true });
//       }).catch(function (error) {
//         console.log(error);
//         res.send({ status: false });
//       });

      
//     }).catch(function(err) {
//       res.send({ status: false });
//     })

   
//   });
// };

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit system');
    console.log(fields);

    models.rol_boxes.findOne({
      where: { id: fields.system_id }
    }).then(function (system) {
      if (!system) return res.send({ status: false });

      system.updateAttributes({
        name: fields.name,
        rol_group_id: parseInt(fields.group_id, 10),
        position: parseInt(fields.position, 10) || 0,
        is_color: parseInt(fields.is_color, 10) || 0,
        is_split: parseInt(fields.is_split, 10) || 0,
        is_grid: parseInt(fields.is_grid, 10) || 0,
        is_security: parseInt(fields.is_security, 10) || 0,
        is_revision: parseInt(fields.is_revision, 10) || 0,
        is_engine: parseInt(fields.is_engine, 10) || 0,
        description: fields.description
      });

      // собираем массивы
      let heights = Object.keys(fields)
        .filter(key => key.startsWith('height_'))
        .map(key => Number(fields[key]));
      let width = Object.keys(fields)
        .filter(key => key.startsWith('width_'))
        .map(key => Number(fields[key]));

      const size_ids = (fields.size_ids || '')
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(n => Number.isFinite(n));

      // оборачиваем цикл размеров в промисы
      const sizePromises = heights.map((height, index) => {
        if (parseInt(height, 10) > 0 && size_ids[index]) {
          return models.rol_box_sizes.findOne({
            where: { id: size_ids[index] }
          }).then(function (row) {
            if (!row) return null; // на всякий случай
            return row.updateAttributes({
              height: height,
              width: width[index]
            });
          });
        } else if (parseInt(height, 10) > 0 && !size_ids[index]) {
          return models.rol_box_sizes.create({
            id_rol_box: fields.system_id,
            height: height,
            width: width[index]
          });
        }
        return Promise.resolve(); // ничего делать не нужно
      });

      // ждем все размеры, потом уже картинку и ответ
      Promise.all(sizePromises).then(function () {
        if (!files || !files.rolet_img || !files.rolet_img.name) {
          return res.send({ status: true });
        }

        var imageUrl =
          '/local_storage/rollets/' +
          Math.floor(Math.random() * 1000000) +
          files.rolet_img.name;

        // если loadImage асинхронная и возвращает промис — дождемся
        var p = loadImage(files.rolet_img.path, imageUrl);
        var maybePromise = p && typeof p.then === 'function' ? p : Promise.resolve();

        return maybePromise
          .then(function () {
            return system.updateAttributes({ img: imageUrl });
          })
          .then(function () {
            res.send({ status: true });
          })
          .catch(function (error) {
            console.log(error);
            res.send({ status: false });
          });
      }).catch(function (e) {
        console.log(e);
        res.send({ status: false });
      });

    }).catch(function (err) {
      res.send({ status: false });
    });
  });
};

