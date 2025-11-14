var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit end list');
    console.log(fields);

    models.rol_end_lists.findOne({
      where: {id: fields.end_list_id}
    }).then(function(endList) {
      if (endList) {
        endList.updateAttributes({
          name: fields.name,
          position: parseInt(fields.position, 10) || 0,
          price: Number(fields.price) || 0,
          is_color: parseInt(fields.is_color, 10) || 0,
          is_key: parseInt(fields.is_key, 10) || 0,
          description: fields.description
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
