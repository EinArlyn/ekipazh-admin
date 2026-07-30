var models = require('../../../lib/models/index.js');
var parseForm = require('../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>Add system');
    console.log(fields);

    var profileLinks = [];
    var ptProfileLinks = [];

    if (fields.profile_links) {
      try {
        profileLinks = JSON.parse(fields.profile_links);
      } catch (e) {
        console.error('Error parsing profile_links:', e);
      }
    }

    if (fields.pt_profile_links) {
      try {
        ptProfileLinks = JSON.parse(fields.pt_profile_links);
      } catch (e) {
        console.error('Error parsing pt_profile_links:', e);
      }
    }

    models.muntins.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      type_id: parseInt(fields.type_id, 10),
      is_active: 1,
      position: parseInt(fields.position, 10) || 0,
      min_gap: Number(fields.min_gap) || 0,
      price: Number(fields.price) || 0,
      currency_id: parseInt(fields.currency_id, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    })
    .then(function (newSystem) {
      var tasks = [];

      for (var i = 1; i <= 5; i += 1) {
        var widthValue = fields['width_' + i];
        var priceValue = fields['price_' + i];

        if (String(widthValue || '').trim() !== '') {
          tasks.push(
            models.muntins_widths.create({
              muntins_id: newSystem.id,
              width: Number(widthValue) || 0,
              price: Number(priceValue) || 0,
            })
          );
        }
      }

      profileLinks.forEach(function (profileId) {
        var linkedProfileId = parseInt(profileId, 10);
        if (linkedProfileId) {
          tasks.push(
            models.muntins_profile_links.create({
              muntins_id: newSystem.id,
              profile_id: linkedProfileId,
            })
          );
        }
      });

      ptProfileLinks.forEach(function (ptProfileId) {
        var linkedPtProfileId = parseInt(ptProfileId, 10);
        if (linkedPtProfileId) {
          tasks.push(
            models.muntins_pt_profile_links.create({
              muntins_id: newSystem.id,
              pt_profile_id: linkedPtProfileId,
            })
          );
        }
      });


      return Promise.all(tasks)
        .then(function () {
          // если файла нет — на этом всё
          if (!(files && files.muntins_img && files.muntins_img.name)) {
            return 'no-image';
          }

          const imageUrl =
            '/local_storage/muntins/' +
            Math.floor(Math.random() * 1000000) +
            files.muntins_img.name;

          // если loadImage возвращает промис — подождем; если нет — просто идем дальше
          const maybePromise = loadImage(files.muntins_img.path, imageUrl);
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

