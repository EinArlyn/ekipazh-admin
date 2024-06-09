var md5 = require('md5');
var models = require('../../lib/models');
var parseForm = require('../../lib/services/formParser').parseForm;
var loadImage = require('../../lib/services/imageLoader').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false });

    var pass = md5(fields.password);
    var deviceCode = md5(fields.mobPhone);

    models.users.create({
      email: fields.email,
      password: pass,
      short_id: fields.shortId,
      parent_id: parseInt(req.session.user.id, 10),
      factory_id: parseInt(req.session.user.factory_id, 10),
      name: fields.name,
      phone: fields.mobPhone,
      //inn: ,
      //okpo: ,
      //mfo: ,
      //bank_name: ,
      //bank_acc_no: ,
      //director: ,
      //stamp_file_name: ,
      locked: 1,
      user_type: 5,
      //contact_name: ,
      city_phone: fields.cityPhone,
      city_id: parseInt(fields.cityId, 10),
      //legal_name: ,
      fax: fields.fax,
      avatar: '/assets/images/avatar.png',
      address: fields.address,
      //birthday: ,
      //sex: ,
      device_code: deviceCode,
      modified: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      entries: 1
    }).then(function (result) {      
      if (!files.avatar.name) return res.send({ status: true });

      var url = '/local_storage/avatars/' + Math.floor(Math.random()*1000000) + files.avatar.name + '.png';
      loadImage(files.avatar.path, url);

      models.users.find({
        where: {
          id: result.id
        }
      }).then(function (newUser) {
        newUser.updateAttributes({
          avatar: url
        });
        res.send({ status: true });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  });
}
