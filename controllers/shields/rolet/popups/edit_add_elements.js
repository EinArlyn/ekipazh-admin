var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
 parseForm(req, function (err, fields, files) {
    console.log('EDIT>>>',fields)
    models.rol_add_elements.findOne({
      where: {id: fields.add_element_id}
    }).then(function(addElem) {
      if (addElem) {
        addElem.updateAttributes({
          name: fields.name,
          price: Number(fields.price),
          rule: parseInt(fields.rule, 10),
          min_qty: parseInt(fields.min_qty, 10) || 0,
          is_fix_price: parseInt(fields.is_fix_price, 10) || 0,
          position: parseInt(fields.position, 10),
          description: fields.description,
        }).then(function(newAddElem) {
          if (!files.rolet_img.name) return res.send({ status: true });

          var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
          loadImage(files.rolet_img.path, imageUrl);

          newAddElem.updateAttributes({
            img: imageUrl
          }).then(function (newAddElem) {
            res.send({ status: true });
          }).catch(function (error) {
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
