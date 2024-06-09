'use strict';
var models = require('../../../lib/models');

exports._getAvailableSets = _getAvailableSets;

function _getAvailableSets (factoryId, done) {
  models.sequelize.query("" +
    "SELECT L.id, L.name " +
    "FROM lists L " +
      "JOIN elements E " +
      "ON L.parent_element_id = E.id " +
      "JOIN lists_groups LG " +
      "ON L.list_group_id = LG.id " +
    "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 5" +
  "").then(function (frameLists) {
    models.sequelize.query("" +
      "SELECT L.id, L.name " +
      "FROM lists L " +
        "JOIN elements E " +
        "ON L.parent_element_id = E.id " +
        "JOIN lists_groups LG " +
        "ON L.list_group_id = LG.id " +
      "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 2" +
    "").then(function (doorSillLists) {
      models.sequelize.query("" +
        "SELECT L.id, L.name " +
        "FROM lists L " +
          "JOIN elements E " +
          "ON L.parent_element_id = E.id " +
          "JOIN lists_groups LG " +
          "ON L.list_group_id = LG.id " +
        "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 3" +
      "").then(function (impostLists) {
        models.sequelize.query("" +
          "SELECT L.id, L.name " +
          "FROM lists L " +
            "JOIN elements E " +
            "ON L.parent_element_id = E.id " +
            "JOIN lists_groups LG " +
            "ON L.list_group_id = LG.id " +
          "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 9" +
        "").then(function (shtulpLists) {
          models.sequelize.query("" +
            "SELECT L.id, L.name " +
            "FROM lists L " +
              "JOIN elements E " +
              "ON L.parent_element_id = E.id " +
              "JOIN lists_groups LG " +
              "ON L.list_group_id = LG.id " +
            "WHERE E.factory_id = " + factoryId + " AND L.list_type_id IN (6,7)" +
          "").then(function (leafs) {
            models.sequelize.query("" +
              "SELECT L.id, L.name " +
              "FROM lists L " +
                "JOIN elements E " +
                "ON L.parent_element_id = E.id " +
                "JOIN lists_groups LG " +
                "ON L.list_group_id = LG.id " +
              "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 34" +
            "").then(function (frameBottomLists) {
              models.lamination_factory_colors.findAll({
                where: {
                  factory_id: factoryId
                }
              }).then(function(laminationColors) {
                done(null, {
                  frameLists: frameLists,
                  doorSillLists: doorSillLists,
                  impostLists: impostLists,
                  shtulpLists: shtulpLists,
                  frameBottomLists: frameBottomLists,
                  leafs: leafs,
                  laminations: laminationColors
                });
              }).catch(function (error) {
                console.log(error);
                done(error);
              });
            }).catch(function (error) {
              console.log(error);
              done(error);
            });
          }).catch(function (error) {
            console.log(error);
            done(error);
          });
        }).catch(function (error) {
          console.log(error);
          done(error);
        });
      }).catch(function (error) {
        console.log(error);
        done(error);
      });
    }).catch(function (error) {
      console.log(error);
      done(error);
    });
  }).catch(function (error) {
    console.log(error);
    done(error);
  });
}
