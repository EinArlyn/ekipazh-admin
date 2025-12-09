var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Add group system');
    console.log(fields);

    var country_list = [];
    try {
      country_list = JSON.parse(fields.country_list || '[]');
    } catch (e) {
      console.error('Invalid country_list JSON:', fields.country_list);
      return res.send({ status: false });
    }

    models.rol_groups.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      is_activ: 1,
      position: parseInt(fields.position, 10) || 0,
      currency_id: parseInt(fields.currency_id, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    })
    .then(function (newGroup) {
      // создаём соответствия стран, если есть что создавать
      var countryPromises = (Array.isArray(country_list) ? country_list : []).map(function (countryObj) {
        return models.compliance_rol_groups.create({
          rol_group_id: newGroup.id,
          country_id: countryObj.country_id
        });
      });

      return Promise.all(countryPromises)
        .then(function () {
          // картинка опциональна: если файла нет — выходим
          if (!(files && files.rolet_img && files.rolet_img.name)) {
            return null;
          }

          var imageUrl = '/local_storage/rollets/' +
            Math.floor(Math.random() * 1000000) +
            files.rolet_img.name;

          // если loadImage возвращает промис — подождём, иначе — просто продолжим
          var maybe = loadImage(files.rolet_img.path, imageUrl);
          var waitLoad = (maybe && typeof maybe.then === 'function') ? maybe : Promise.resolve();

          return waitLoad.then(function () {
            return newGroup.updateAttributes({ img: imageUrl });
          });
        });
    })
    .then(function () {
      res.send({ status: true });
    })
    .catch(function (e) {
      console.error('add group system error:', e);
      res.send({ status: false });
    });
  });
};
