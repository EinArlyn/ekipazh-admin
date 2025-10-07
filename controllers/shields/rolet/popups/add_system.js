var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add system');
    console.log(fields);
    models.rol_boxes.create({
      name: fields.name,
      rol_group_id: parseInt(fields.group_id, 10),
      is_activ: 1,
      position: parseInt(fields.position, 10) || 0,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_split: parseInt(fields.is_split, 10) || 0,
      is_grid: parseInt(fields.is_grid, 10) || 0,
      is_security: parseInt(fields.is_security, 10) || 0,
      is_revision: parseInt(fields.is_revision, 10) || 0,
      is_engine: parseInt(fields.is_engine, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function (newSystem) {
      let heights = Object.keys(fields)          
        .filter(key => key.startsWith('height_'))
        .map(key => fields[key])                    
        .map(Number);  
      let width = Object.keys(fields)          
        .filter(key => key.startsWith('width_'))
        .map(key => fields[key])                    
        .map(Number);  

      heights.forEach((height, index) => {
        if (parseInt(height, 10) > 0) {
          models.rol_box_sizes.create({
            id_rol_box: newSystem.id,
            height: height,
            width: width[index]
          })
        }
      })

      if (!files.rolet_img.name) return res.send({ status: true });

      var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
      loadImage(files.rolet_img.path, imageUrl);

      newSystem.updateAttributes({
        img: imageUrl
      }).then(function (newSystem) {
        res.send({ status: true });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
      
      
    })
    
  });
};
