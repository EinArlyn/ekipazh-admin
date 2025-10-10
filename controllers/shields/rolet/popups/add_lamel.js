var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

/**
 * Add additional color
 */
module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>Add lamel');
    console.log(fields);

    // models.rol_lamels.create({
    //   factory_id: parseInt(req.session.user.factory_id, 10),
    //   name: fields.name,
    //   is_activ: 1,
    //   height: parseInt(fields.height, 10) || 0,
    //   is_color: parseInt(fields.is_color, 10) || 0,
    //   is_key: parseInt(fields.is_key, 10) || 0,
    //   description: fields.description,
    //   img: '/local_storage/default.png'
    // }).then(function(newLamel) {
    //   const end_list = JSON.parse(fields.end_list);
    //   const size_list = JSON.parse(fields.size_list);

    //   end_list.forEach(list => {
    //     models.rol_lamels_end_lists.create({
    //       rol_lamel_id: newLamel.id,
    //       rol_end_list_id: list
    //     })
    //   })

    //   size_list.forEach(guide => {
    //     models.rol_lamels_guides.create({
    //       rol_lamel_id: newLamel.id,
    //       rol_guide_id: guide.id,
    //       max_width: guide.width,
    //       max_square: guide.square
    //     })
    //   })

    //   if (!files.rolet_img.name) return res.send({ status: true });

    //   var imageUrl = '/local_storage/rollets/' + Math.floor(Math.random() * 1000000) + files.rolet_img.name;
    //   loadImage(files.rolet_img.path, imageUrl);

    //   newLamel.updateAttributes({
    //     img: imageUrl
    //   }).then(function (newLamel) {
    //     res.send({ status: true });
    //   }).catch(function (error) {
    //     console.log(error);
    //     res.send({ status: false });
    //   });


    // }).catch(function(err){
    //   res.send({status: false});
    // });

    models.rol_lamels.create({
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      is_activ: 1,
      height: parseInt(fields.height, 10) || 0,
      is_color: parseInt(fields.is_color, 10) || 0,
      is_key: parseInt(fields.is_key, 10) || 0,
      description: fields.description,
      img: '/local_storage/default.png'
    }).then(function (newLamel) {
      const end_list  = JSON.parse(fields.end_list  || '[]');
      const size_list = JSON.parse(fields.size_list || '[]');

      const endPromises = end_list.map(function (listId) {
        return models.rol_lamels_end_lists.create({
          rol_lamel_id: newLamel.id,
          rol_end_list_id: listId
        });
      });

      const guidePromises = size_list.map(function (guide) {
        return models.rol_lamels_guides.create({
          rol_lamel_id: newLamel.id,
          rol_guide_id: guide.id,
          max_width: guide.width,
          max_square: guide.square
        });
      });

      return Promise.all(endPromises.concat(guidePromises))
        .then(function () {
          
          if (!(files && files.rolet_img && files.rolet_img.name)) {
            return null; 
          }

          var imageUrl = '/local_storage/rollets/' +
            Math.floor(Math.random() * 1000000) + files.rolet_img.name;

          var p = loadImage(files.rolet_img.path, imageUrl);
          var waitLoad = (p && typeof p.then === 'function') ? p : Promise.resolve();

          return waitLoad.then(function () {
            return newLamel.update({ img: imageUrl });
          });
        });
    }).then(function () {
      res.send({ status: true });
    }).catch(function (err) {
      console.error(err);
      res.send({ status: false });
    });

    
  });
};
