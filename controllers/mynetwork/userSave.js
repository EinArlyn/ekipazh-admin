var md5 = require('md5');
var _ = require('lodash');
var async = require('async');

var parseForm = require('../../lib/services/formParser').parseForm;
var loadImage = require('../../lib/services/imageLoader').loadImage;
var validateNewRecords = require('../../lib/services/userHistory').validateNewRecords;
var models = require('../../lib/models');

/**
 * Save user
 * @param {integer}  userId
 * @param {string}   shortId
 * @param {string}   name
 * @param {string}   contactName
 * @param {mixed}    mobPhone
 * @param {string}   email
 * @param {mixed}    cityPhone
 * @param {mixed}    fax
 * @param {string}   address
 * @param {string}   director
 * @param {string}   legalName
 * @param {string}   inn
 * @param {string}   okpo
 * @param {string}   mfo
 * @param {string}   bank
 * @param {string}   bancAcc
 * @param {integer}  city
 * @param {integer}  identificator
 * @param {string}   avatar
 */
module.exports = function (req, res) {
  var userId = req.params.userId;

  parseForm(req, function (err, fields, files) {
    models.users.find({
      where: {
        id: userId
      }
    }).then(function(user) {
      var oldRow = JSON.stringify(user.dataValues);
      var userParentId = user.parent_id;
      var identificators = {
        prev: user.identificator,
        new: fields.identificator
      };

      user.updateAttributes({
        short_id: fields.short_id,
        name: fields.name,
        contact_name: fields.contact_name,
        phone: fields.phone,
        email: fields.email,
        code_sync: fields.code_sync,
        export_folder: fields.export_folder,
        city_phone: fields.city_phone,
        fax: fields.fax,
        address: fields.address,
        director: fields.director,
        legal_name: fields.legal_name,
        inn: fields.inn,
        okpo: fields.okpo,
        mfo: fields.mfo,
        bank_name: fields.bank_name,
        bank_acc_no: fields.bank_acc_no,
        city_id: parseInt(fields.city_id, 10)
        // identificator: parseInt(fields.identificator, 10)
      }).then(function() {
        if (userId == req.session.user.id) {
          req.session.user.name = fields.name;
          req.session.user.city_id = fields.city_id;
        }

        if (fields.parentId && (userParentId !== parseInt(fields.parentId, 10))) {
          __reasignUser(userId, fields.parentId, function(err) {
            res.send({ status: true, identificators: identificators });
          });
        } else {
          res.send({ status: true, identificators: identificators, userId: userId });
        }

        models.users.find({
          where: {id: userId}
        }).then(function (user) {
          var newRow = JSON.stringify(user.dataValues);
          validateNewRecords(userId, 'users', oldRow, newRow, req.session.user.id + ' ' + req.session.user.name);
        });

        if (files.avatar.name) {
          console.log('IS AVATAR', files.avatar.name);
          var avatarUrl = '/local_storage/avatars/' + Math.floor(Math.random() * 1000000) + files.avatar.name;

          loadImage(files.avatar.path, avatarUrl);
          models.users.find({
            where: {id: userId}
          }).then(function(user) {
            user.updateAttributes({
              avatar: avatarUrl
            });
          });
        }

      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });
}

// function __changeUserPassword(userId, newPassword) {
//   var pass = md5(newPassword);

//   models.users.update({
//     password: pass
//   }, {
//     where: {
//       id: userId
//     }
//   }).then(function() {
//     console.log('Password changed');
//   }).catch(function(err) {
//     console.log(err);
//   });
// }

function __reasignUser(userId, newParentId, cb) {
  var validUser = {};
  async.waterfall([
    /** check discounts */
    function(_cb) {
      models.users_discounts.find({
        where: { user_id: userId },
        attributes: ['id', 'max_construct', 'max_add_elem']
      }).then(function(currentUserDiscounts) {
        models.users_discounts.find({
          where: { user_id: newParentId },
          attributes: ['id', 'max_construct', 'max_add_elem']
        }).then(function(parentDiscounts) {
          /** If user hasn't discounts */
          var crntUser = {
            maxConstruct: currentUserDiscounts.max_construct || 0,
            maxAddElem: currentUserDiscounts.max_add_elem || 0
          };
          /** If parent hasn't discounts */
          var prnt = {
            maxConstruct: parentDiscounts.max_construct || 0,
            maxAddElem: parentDiscounts.max_add_elem || 0
          };

          validUser.maxConstruct = (crntUser.maxConstruct <= prnt.maxConstruct ? crntUser.maxConstruct : prnt.maxConstruct);
          validUser.maxAddElem = (crntUser.maxAddElem <= prnt.maxAddElem ? crntUser.maxAddElem : prnt.maxAddElem);

          _cb(null);
        }).catch(function(err) {
          console.log(err);
          _cb(err);
        });
      }).catch(function(err) {
        console.log(err);
        _cb(err);
      });
    },
    /** check assecces */
    function(_cb) {
      models.users_accesses.findAll({
        where: {user_id: userId},
        attributes: ['menu_id']
      }).then(function(currentUserAccesses) {
        models.users_accesses.findAll({
          where: {user_id: newParentId},
          attributes: ['menu_id']
        }).then(function(parentAccesses) {
          var crntUser = _.pluck(currentUserAccesses, 'dataValues.menu_id');
          var prnt = _.pluck(parentAccesses, 'dataValues.menu_id');
          validUser.diff = _.difference(crntUser, prnt);

          _cb(null);
        }).catch(function(err) {
          console.log(err);
          _cb(err);
        });
      }).catch(function(err) {
        console.log(err);
        _cb(err);
      });
    },
    /** update discounts + accesses */
    function(_cb) {
      models.users_discounts.findOrCreate({
        where: {user_id: userId}
      }).spread(function(crntUser) {
        crntUser.updateAttributes({
          max_construct: parseFloat(validUser.maxConstruct),
          max_add_elem: parseFloat(validUser.maxAddElem)
        }).then(function() {
          if (!validUser.diff.length) _cb(null);

          models.users_accesses.destroy({
            where: {user_id: userId, menu_id: {$in: validUser.diff}}
          }).then(function() {
            _cb(null);
          }).catch(function() {
            console.log(err);
            _cb(err);
          });
        }).catch(function() {
          console.log(err);
          _cb(err);
        });
      }).catch(function(err) {
        console.log(err);
        _cb(err);
      });
    },
    /** validate user types */
    function(_cb) {
      models.users.find({
        where: {id: userId},
        attributes: ['id', 'is_payer', 'is_employee', 'is_buch', 'is_to', 'is_all_calcs']
      }).then(function(crntUser) {
        models.users.find({
          where: {id: newParentId},
          attributes: ['is_payer', 'is_employee', 'is_buch', 'is_to', 'is_all_calcs']
        }).then(function(prnt) {
          var obj = {};
          _.mapKeys(crntUser.dataValues, function(value, key) {
            if (prnt.dataValues[key] < value) return obj[key] = 0;
          });
          validUser.diffTypes = obj;

          crntUser.updateAttributes(obj).then(function() {
            _cb(null);
          }).catch(function(err) {
            console.log(err);
          _cb(err);
          });
        }).catch(function(err) {
          console.log(err);
          _cb(err);
        });
      }).catch(function(err) {
        console.log(err);
        _cb(err);
      });
    }
  ], function(err, result) {
    if (err) return cb(err);

    models.users.find({
      where: { id: userId }
    }).then(function(currentUser) {
      currentUser.updateAttributes({
        parent_id: parseInt(newParentId, 10)
      }).then(function() {
        cb(null);
      }).catch(function(err) {
        console.log(err);
        cb(err);
      });
    }).catch(function(err) {
      console.log(err);
      cb(err);
    });
  });
}
