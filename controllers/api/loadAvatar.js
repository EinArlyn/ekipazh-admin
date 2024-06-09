var formidable = require('formidable');
var models = require('../../lib/models');
var loadImage = require('../../lib/services/imageLoader').loadImage;

module.exports = function(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    var url = '/local_storage/avatars/' + Math.floor(Math.random()*1000000) + files.file.name;
    loadImage(files.file.path, url);
    models.users.findOne({
      where: {id: fields.user}
    }).then(function (user) {
      user.updateAttributes({
        avatar: url
      }).then(function() {
        res.send({status: true});
      }).catch(function (err) {
        console.log(err);
        res.send({status: false});
      })
    }).catch(function (err) {
      console.log(err);
      res.send({status: false});
    });
  });
};
