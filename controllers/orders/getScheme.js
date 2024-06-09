var models = require('../../lib/models');
var async = require('async');

/**
 * Get scheme of product
 * @param {integer} params.id - Order product Id
 */
module.exports = function (req, res) {
  var id = req.params.id;

  models.order_products.findOne({
    where: { id: id },
    attributes: ['template_source', 'template_width', 'template_height', 'profile_id', 'door_group_id']
  }).then(function (product) {
    /** Find profile system for parsing depths */
    models.profile_systems.find({
      where: { id: product.profile_id }
    }).then(function (profileSystem) {
      if (profileSystem) return _getTemplateStruct(profileSystem, sendResponse);
      
      /** Find door group for parsing depths*/
      models.doors_groups.find({
        where: { id: product.door_group_id }
      }).then(function (doorGroup) {
        _getTemplateStruct(doorGroup, sendResponse);
      }).catch(function (error) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function (err) {
      console.log(err);
      res.send({ status: false });
    });

    function sendResponse (data) {
      res.send({
        product: product,
        frame: data.frame,
        frameStill: data.frameStill,
        impost: data.impost,
        shtulp: data.shtulp,
        sash: data.sash
      });
    }
  });

};


function _getTemplateStruct (system, cb) {
  async.series([
    /** Find frame depths */
    function (_callback) {
      models.lists.find({
        where: { id: system.rama_list_id },
        attributes: ['a', 'b', 'c', 'd']
      }).then(function (frame) {
        _callback(null, frame);
      }).catch(function (err) {
        console.log(err);
        _callback(null, {});
      });
    },
    /** Find frameStill depths */
    function (_callback) {
      models.lists.find({
        where: { id: system.rama_still_list_id },
        attributes: ['a', 'b', 'c', 'd']
      }).then(function (frameStill) {
        _callback(null, frameStill);
      }).catch(function (err) {
        console.log(err);
        _callback(null, {});
      });
    },
    /** Find impost depths */
    function (_callback) {
      models.lists.find({
        where: { id: system.impost_list_id },
        attributes: ['a', 'b', 'c', 'd']
      }).then(function (impost) {
        _callback(null, impost);
      }).catch(function (err) {
        console.log(err);
        _callback(null, {});
      });
    },
    /** Find shtulp depths */
    function (_callback) {
      models.lists.find({
        where:  {id: system.shtulp_list_id },
        attributes: ['a', 'b', 'c', 'd']
      }).then(function (shtulp) {
        _callback(null, shtulp);
      }).catch(function (err) {
        console.log(err);
        _callback(null, {});
      });
    },
    /** Find sash depths */
    function (_callback) {
      models.lists.find({
        where: { id: system.stvorka_list_id },
        attributes: ['a', 'b', 'c', 'd']
      }).then(function (sash) {
        _callback(null, sash);
      }).catch(function (err) {
        console.log(err);
        _callback(null, {});
      });
    }
  ], function (err, results) {
    cb({
      frame: results[0],
      frameStill: results[1],
      impost: results[2],
      shtulp: results[3],
      sash: results[4]
    });
  });
}
