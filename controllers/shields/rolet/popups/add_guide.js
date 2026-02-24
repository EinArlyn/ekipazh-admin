var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add guide');
    console.log(fields);

    models.rol_guides.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      position: parseInt(fields.position, 10) || 0,
      is_activ: 1,
      height: Number(fields.height) || 0,
      thickness: Number(fields.thickness) || 0,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_grid: parseInt(fields.is_grid, 10) || 0,
      price: Number(fields.price) || 0,
      price_m: Number(fields.price_m) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function(newGuide){
      let m2OrMData = {};
      if (fields.m2_or_m) {
        try {
          m2OrMData = JSON.parse(fields.m2_or_m);
        } catch (error) {
          console.log(error);
        }
      }

      const rulesRows = Object.keys(m2OrMData).map(function(groupId) {
        return {
          rol_guide_id: newGuide.id,
          rol_groups_id: parseInt(groupId, 10) || 0,
          rol_price_rules_id: parseInt(m2OrMData[groupId], 10) || 0
        };
      });

      const rulesPromise = rulesRows.length
        ? Promise.all(rulesRows.map(function(row) {
            return models.rol_guide_box_price_rules.create(row);
          }))
        : Promise.resolve();

      rulesPromise.then(function() {
        if (!files.rolet_img.name) return res.send({ status: true });

        const imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
        loadImage(files.rolet_img.path, imageUrl);

        newGuide.updateAttributes({
          img: imageUrl
        }).then(function () {
          res.send({ status: true });
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }).catch(function(error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function(err) {
      res.send({status: false})
    })
    
  });
};
