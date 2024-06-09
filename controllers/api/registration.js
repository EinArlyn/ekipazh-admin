var md5 = require('md5');

var models = require('../../lib/models');
var sendActivationEmail = require('../../lib/services/mailer').sendActivationEmail;
var syncUserSettings = require('../../lib/services/syncAccount').syncUser;

module.exports = function(req, res) {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var cityId = req.body.cityId;
  var password = req.body.password;
  var device_code = md5(phone);

  models.users.create({
    email: email,
    password: password,
    //session: ,
    //short_id: ,
    //parent_id: ,
    //factory_id: ,
    //discount_construct_max: ,
    //discount_construct_default: ,
    //discount_addelem_max: ,
    //discount_addelem_default: ,
    name: name,
    phone: phone,
    //inn: ,
    //okpo: ,
    //mfo: ,
    //bank_name: ,
    //bank_acc_no: ,
    //director: ,
    //stamp_file_name: ,
    locked: 0,
    user_type: 7,
    //contact_name: ,
    //city_phone: ,
    city_id: parseInt(cityId),
    //legal_name: ,
    //fax: ,
    avatar: '/local_storage/avatars/default.png',
    //birthday: ,
    //sex: ,
    //margin_mounting_mon: ,
    //margin_mounting_tue: ,
    //margin_mounting_wed: ,
    //margin_mounting_thu: ,
    //margin_mounting_fri: ,
    //margin_mounting_sat: ,
    //margin_mounting_sun: ,
    //min_term: ,
    //base_term: ,
    //internal_count: ,
    device_code: device_code,
    modified: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }).then(function(result) {
    sendActivationEmail(email);
    syncUserSettings(result.id.toString());
    res.send({status: true});
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
};
