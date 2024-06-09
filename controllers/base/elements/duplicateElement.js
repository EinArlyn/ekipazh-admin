var models = require('../../../lib/models');
var async = require('async');

/**
 * Duplicate current element
 * @param {integer} params.id - Id of element, that will be duplicated
 */
module.exports = function (req, res) {
  var id = req.params.id;

  models.elements.find({
    where: { id: id }
  }).then(function (element) {
    var factoryId = req.session.user.factory_id;
    var sku = element.sku.replace(/\s\(\d+\)/, '');
    var name = element.name.replace(/\s\(\d+\)/, '');

    __validate(sku, name, factoryId, {sku: 1, name: 1}, function(data) {
      if (data.status) {
        /** Find all profile systems */
        models.elements_profile_systems.findAll({
          where: {element_id: id},
          attributes: ['profile_system_id']
        }).then(function(profileSystems) {
          var ps = profileSystems.map(function (system) {
            return system.dataValues.profile_system_id;
          });
          /** Start duplicate */
          __duplicateElement(element, data.name, data.sku, id, ps);
        });
        res.send({status: true, name: element.name});
      } else {
        res.send({status: false});
      }
    });
  });
}

/**
 * Helpers
 * [1] - Validate on already existing element (it should define new sku and name)
 * [2] - Duplicate current element
 * [3] - Duplicate lists of current element
 */

 /**
  * [1] Validate already existing elements name and sku
  * @param {string} sku - Sku of searched element
  * @param {string} name - Name of searched element
  * @param {integer} factoryId - Factory Id of searched element
  * @param {object} indexes - New possible predefined element sku/name
  * @callback callback
  */
 function __validate(sku, name, factoryId, indexes, callback) {
   return models.elements.findAll({
     where: {
       sku: sku + ' (' + indexes.sku + ')',
       factory_id: factoryId
     },
     attributes: ['id', 'sku', 'name']
   }).then(function (elementWithSku) {
     if (elementWithSku.length) {
       indexes.sku = indexes.sku + 1;
       return __validate(sku, name, factoryId, indexes, callback);
     } else {
       models.elements.findAll({
         where: {
           name: name + ' (' + indexes.name + ')',
           factory_id: factoryId
         },
         attributes: ['id', 'sku', 'name']
       }).then(function (elementWithName) {
         if (elementWithName.length) {
           indexes.name = indexes.name + 1;
           return __validate(sku, name, factoryId, indexes, callback);
         }

         callback({
           status: true,
           sku: sku + ' (' + indexes.sku + ')',
           name: name + ' (' + indexes.name + ')'
         });
       }).catch(function (error) {
         console.log(error);
         callback({ status: false });
       });
     }
   }).catch(function (error) {
     console.log(error);
     callback({ status: false });
   });
 }

  /**
   * [2] Duplicate current element
   * @param {object} element - Current element
   * @param {string} name - New element name
   * @param {string} sku - New element sku
   * @param {integer} duplicatId - Current element Id
   * @param {object} profileSystems - Profile systems of current element
   */
  function __duplicateElement(element, name, sku, duplicatId, profileSystems) {
    models.elements.create({
      sku: sku,
      name: name,
      element_group_id: parseInt(element.element_group_id),
      currency_id: parseInt(element.currency_id),
      supplier_id: parseInt(element.supplier_id),
      margin_id: parseInt(element.margin_id),
      waste: parseFloat(element.waste),
      is_optimized: parseInt(element.is_optimized),
      is_virtual: parseInt(element.is_virtual),
      is_additional: parseInt(element.is_additional),
      weight_accounting_unit: parseFloat(element.weight_accounting_unit),
      glass_folder_id: parseInt(element.glass_folder_id),
      min_width: parseFloat(element.min_width),
      min_height: parseFloat(element.min_height),
      max_width: parseFloat(element.max_width),
      max_height: parseFloat(element.max_height),
      max_sq: parseFloat(element.max_sq),
      transcalency: parseFloat(element.transcalency),
      glass_width: parseInt(element.glass_width),
      factory_id: parseInt(element.factory_id),
      price: parseFloat(element.price),
      amendment_pruning: parseFloat(element.amendment_pruning),
      modified: new Date(),
      noise: parseInt(element.noise)
    }).then(function (result) {
      var newElementId = result.id.toString();

      async.waterfall([
        /** Duplicate profile systems */
        function (__callback) {
          if (profileSystems.length) {
            for (var i = 0, len = profileSystems.length; i < len; i++) {
              models.elements_profile_systems.create({
                profile_system_id: parseInt(profileSystems[i]),
                element_id: parseInt(newElementId),
                modified: new Date()
              }).catch(function(err) {
                console.log(err);
              });
            }
            __callback(null);
          } else {
            __callback(null);
          }
        },
        /** Duplicate child lists */
        function (__callback) {
          models.lists.findAll({
            where: { parent_element_id: duplicatId }
          }).then(function (lists) {
            if (lists.length) {
              for (var i = 0, len = lists.length; i < len; i++) {
                __duplicateLists(lists[i], newElementId);
              }
              __callback(null);
            } else {
              __callback(null);
            }
          });
        }
      ], function(err, result) {
        // Done
      });
      //res.send({status: true, name: element.name});
    }).catch(function(error) {
      console.dir(error);
      //res.send({status: false});
    });
  }

  /**
   * [3] Duplicate lists of current element
   * @param {object} list - List of current element
   * @param {integer} newParentId - Id of new element
   */
  function __duplicateLists (list, newParentId) {
    models.lists.create({
      name: list.name + ' (1)',
      list_group_id: parseInt(list.list_group_id),
      list_type_id: parseInt(list.list_type_id),
      a: parseFloat(list.a),
      b: parseFloat(list.b),
      c: parseFloat(list.c),
      d: parseFloat(list.d),
      parent_element_id: parseInt(newParentId),
      position: parseInt(list.position),
      add_color_id: parseInt(list.add_color_id),
      modified: new Date(),
      addition_folder_id: parseInt(list.addition_folder_id),
      amendment_pruning: parseFloat(list.amendment_pruning) || 0.00,
      waste: parseFloat(list.waste) || 0.00,
      cameras: parseInt(list.cameras) || 1,
      sills_group: parseInt(list.sills_group)
    }).then(function (result) {
      var newListId = result.id.toString();

      /** Duplicate beeds profile systems */
      models.elements_profile_systems.findAll({
        where: { element_id: newParentId },
        attributes: ['profile_system_id']
      }).then(function (profileSystems) {
        if (profileSystems.length) {
          for (var i = 0, len = profileSystems.length; i < len; i++) {
            models.beed_profile_systems.findOne({
              where: {
                list_id: list.id,
                profile_system_id: profileSystems[i].profile_system_id
              }
            }).then(function (oldBeed) {
              models.beed_profile_systems.create({
                profile_system_id: parseInt(oldBeed.profile_system_id),
                list_id: parseInt(newListId),
                glass_width: parseInt(oldBeed.glass_width),
                modified: new Date()
              });
            });
          }
        }
      });
    }).catch(function(err) {
      console.log(err);
    });
  }
