'use strict';

var models = require('../../lib/models');

module.exports = function (req, res) {
  if (req.body.profileId === '0') return updateUnbindedMosquitos();
  updateProfileMosquitos();

  function updateUnbindedMosquitos () {
    models.mosquitos_singles.find({
      where: {
        id: req.params.id
      }
    }).then(function (mosquito) {
      var updateObj = {};
      updateObj[req.body.type] = parseInt(req.body.value, 10);

      mosquito.updateAttributes(updateObj).then(function () {
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

  function updateProfileMosquitos () {
    models.mosquitos.find({
      where: {
        id: req.params.id
      }
    }).then(function (mosquito) {
      var updateObj = {};
      updateObj[req.body.type] = parseInt(req.body.value, 10);

      mosquito.updateAttributes(updateObj).then(function () {
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
};
