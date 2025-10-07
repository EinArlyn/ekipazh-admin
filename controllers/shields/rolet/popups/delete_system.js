var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;


module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>delete system');
    console.log(fields);
    const box_id = fields.system_id;
    models.rol_box_sizes.destroy({
      where: {id_rol_box: box_id}
    }).then(function() {
      models.rol_boxes.destroy({
        where: {id: box_id}
      }).then(function() {
        res.send({ status: true });
      })
    });
    

    // models.addition_colors.create({
    //   name: fields.name,
    //   lists_type_id: fields.type_id,
    //   modified: new Date(),
    //   img: '/local_storage/default.png',
    // }).then(function(newColor) {      
    //   if (!files.color_img.name) return res.send({ status: true });

    //   var imageUrl = '/local_storage/addition_colors/' + Math.floor(Math.random() * 1000000) + files.color_img.name;
    //   loadImage(files.color_img.path, imageUrl);

    //   newColor.updateAttributes({
    //     img: imageUrl
    //   }).then(function (newColor) {
    //     res.send({ status: true });
    //   }).catch(function (error) {
    //     console.log(error);
    //     res.send({ status: false });
    //   });
    // }).catch(function (err) {
    //   console.log(err);
    //   res.send({ status: false });
    // });
  });
};
