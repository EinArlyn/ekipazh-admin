'use strict';

var models = require('../../lib/models');
var MOSQUITO_PROFILES_ID = 10;
var MOSQUITO_CLOTHS_ID = 20;

module.exports = function (req, res) {
  models.mosquitos_singles.findAll({
    where: {
      factory_id: req.session.user.factory_id
    },
    order: 'id'
  }).then(function (mosquitos) {
    models.sequelize.query("" +
      "SELECT L.id, L.name FROM lists L" +
      " JOIN elements E" +
      " ON L.parent_element_id = E.id " +
      "WHERE E.factory_id=" + parseInt(req.session.user.factory_id) +
      " AND L.list_group_id=" + parseInt(MOSQUITO_PROFILES_ID) +
      " ORDER BY name" +
    "").then(function(mosquitoProfiles) {
      models.sequelize.query("" +
        "SELECT L.id, L.name FROM lists L" +
        " JOIN elements E" +
        " ON L.parent_element_id = E.id " +
        "WHERE E.factory_id=" + parseInt(req.session.user.factory_id) +
        " AND L.list_group_id=" + parseInt(MOSQUITO_CLOTHS_ID) +
        " ORDER BY name" +
      "").then(function(mosquitoCloths) {
        res.send({
          status: true,
          mosquitos: mosquitos,
          mosquitoProfiles: mosquitoProfiles[0],
          mosquitoCloths: mosquitoCloths[0]
        });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
