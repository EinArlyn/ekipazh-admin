var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit guide');
    console.log(fields);
    models.rol_guides.findOne({
      where: {id: fields.guide_id}
    }).then(function(guide) {
      if (guide) {
        guide.updateAttributes({
          name: fields.name,
          position: parseInt(fields.position, 10) || 0,
          height: Number(fields.height) || 0,
          thickness: Number(fields.thickness) || 0,
          is_color: parseInt(fields.is_color, 10) || 0,
          is_grid: parseInt(fields.is_grid, 10) || 0,
          price: Number(fields.price) || 0,
          price_m: Number(fields.price_m) || 0,
          description: fields.description
        }).then(function(newGuide) {
          let m2OrMData = {};
          if (fields.m2_or_m) {
            try {
              m2OrMData = JSON.parse(fields.m2_or_m);
            } catch (error) {
              console.log(error);
            }
          }

          const rulesPromises = Object.keys(m2OrMData).map(function(groupId) {
            return models.rol_guide_box_price_rules.findOne({
              where: {
                rol_guide_id: newGuide.id,
                rol_groups_id: parseInt(groupId, 10) || 0
              }
            }).then(function(existingRule) {
              const ruleValue = parseInt(m2OrMData[groupId], 10) || 0;
              if (existingRule) {
                return existingRule.updateAttributes({
                  rol_price_rules_id: ruleValue
                });
              } else {
                return models.rol_guide_box_price_rules.create({
                  rol_guide_id: newGuide.id,
                  rol_groups_id: parseInt(groupId, 10) || 0,
                  rol_price_rules_id: ruleValue
                });
              }
            });
          });

          const rulesPromise = rulesPromises.length
            ? Promise.all(rulesPromises)
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
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
};
