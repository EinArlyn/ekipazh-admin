var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_add_elements.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      position: parseInt(fields.position, 10),
      price: Number(fields.price),
      rule: parseInt(fields.rule, 10),
      min_qty: parseInt(fields.min_qty, 10) || 0,
      is_fix_price: parseInt(fields.is_fix_price, 10) || 0,
      is_activ: 1,
      description: fields.description,
      img: '/local_storage/default.png'
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
    }).catch(function(err) {
      res.send({status: false})
    })
  });
};
