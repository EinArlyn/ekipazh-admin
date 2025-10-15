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
          height: parseInt(fields.height, 10) || 0,
          thickness: parseInt(fields.thickness, 10) || 0,
          is_color: parseInt(fields.is_color, 10) || 0,
          is_grid: parseInt(fields.is_grid, 10) || 0,
          description: fields.description
        }).then(function(newGuide) {
          if (!files.rolet_img.name) return res.send({ status: true });

          var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
          loadImage(files.rolet_img.path, imageUrl);

          newGuide.updateAttributes({
            img: imageUrl
          }).then(function (newGuide) {
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
