var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>DElETE group system');
    console.log(fields);
    models.rol_boxes.findAll({
      where: {rol_group_id: fields.group_id}
    }).then(function(group) {
      if (group.length) {
        res.send({ status: false });
      } else {
        models.rol_groups.destroy({
          where: {id: fields.group_id}
        }).then(function() {
    
        res.send({ status: true });
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
      }
    })
  });
};
