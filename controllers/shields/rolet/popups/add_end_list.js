var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add end list');
    console.log(fields);

    models.rol_end_lists.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      is_activ: 1,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_key: parseInt(fields.is_key, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function(newEndList) {

      if (!files.rolet_img.name) return res.send({ status: true });

      var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
      loadImage(files.rolet_img.path, imageUrl);

      newEndList.updateAttributes({
        img: imageUrl
      }).then(function (newEndList) {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function(err) {
      res.send({status: false})
    })
    
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
