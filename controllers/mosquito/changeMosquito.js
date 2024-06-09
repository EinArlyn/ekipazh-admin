'use strict';

var models = require('../../lib/models');
var parseForm = require('../../lib/services/formParser').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (fields.profile_id === '0') return updateUnbindedMosquitos();
    updateProfileMosquitos();

    function updateUnbindedMosquitos () {
      models.mosquitos_singles.find({
        where: {
          id: fields.mosquito_id
        }
      }).then(function (mosquito) {
        mosquito.updateAttributes({
          name: fields.name,
          group_id: parseInt(fields.group_id, 10)
        }).then(function () {
          res.send({
            status: true,
            mosquitoId: fields.mosquito_id,
            name: fields.name,
            groupId: fields.group_id
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

    function updateProfileMosquitos () {
      models.mosquitos.find({
        where: {
          id: fields.mosquito_id
        }
      }).then(function (mosquito) {
        mosquito.updateAttributes({
          name: fields.name,
          group_id: parseInt(fields.group_id, 10)
        }).then(function () {
          res.send({
            status: true,
            mosquitoId: fields.mosquito_id,
            name: fields.name,
            groupId: fields.group_id
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
