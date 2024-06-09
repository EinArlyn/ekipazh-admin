'use strict';

var models = require('../../lib/models');
var parseForm = require('../../lib/services/formParser').parseForm;

var MOSQUITO_PROFILES_ID = 10;
var MOSQUITO_CLOTHS_ID = 20;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) return res.send({ status: false });

    if (parseInt(fields.profile_id, 10) === 0) return createUnbindedMosquito();
    createProfileMosquito();

    function createUnbindedMosquito () {
      models.mosquitos_singles.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        bottom_id: 0,
        bottom_waste: 0,
        left_id: 0,
        left_waste: 0,
        top_id: 0,
        top_waste: 0,
        right_id: 0,
        right_waste: 0,
        cloth_id: 0,
        cloth_waste: 0,
        modified: new Date(),
        group_id: parseInt(fields.group_id, 10)
      }).then(function (mosquito) {
        respondMosquito(mosquito);
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }

    function createProfileMosquito() {
      models.mosquitos.create({
        profile_id: parseInt(fields.profile_id, 10),
        name: fields.name,
        bottom_id: 0,
        bottom_waste: 0,
        left_id: 0,
        left_waste: 0,
        top_id: 0,
        top_waste: 0,
        right_id: 0,
        right_waste: 0,
        cloth_id: 0,
        cloth_waste: 0,
        modified: new Date(),
        group_id: parseInt(fields.group_id, 10)
      }).then(function (mosquito) {
        respondMosquito(mosquito);
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }

    function respondMosquito(mosquito) {
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
            mosquito: mosquito,
            mosquitoProfiles: mosquitoProfiles[0],
            mosquitoCloths: mosquitoCloths[0],
            profileId: fields.profile_id
          });
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
      });
    }
  });
};
