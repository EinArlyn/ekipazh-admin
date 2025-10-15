var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Edit group system');
    console.log(fields, files);

    models.rol_groups.findOne({
      where: {id: fields.group_id}
    }).then(function(group) {
      if(group) {
        group.updateAttributes({
          name: fields.name,
          position: parseInt(fields.position, 10),
          description: fields.description,
        }).then(function(editGroup){

          if (!files.rolet_img.name) return res.send({ status: true });

          var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
          loadImage(files.rolet_img.path, imageUrl);

          editGroup.updateAttributes({
            img: imageUrl
          }).then(function (editGroup) {
            res.send({ status: true });
          }).catch(function (error) {
            console.log(error);
            res.send({ status: false });
          });

        }).catch(function(err){
          res.send({ status: false });
        })
      } else {
        res.send({ status: false });
      }
    }).catch(function(err){
      res.send({ status: false});
    })
    
  });
};
