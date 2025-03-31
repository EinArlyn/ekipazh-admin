var models = require('../../lib/models');
var validateNewRecords = require('../../lib/services/userHistory').validateNewRecords;

module.exports = function (req, res) {
  var userId = req.params.userId;

  __maxParentDiscout(req.session.user, userId, req.body.maxConst, req.body.maxAddEl, function(isValid, parentValue) {
    if (!isValid) return res.send({ status: false, parentValue: parentValue });

    models.users_discounts.findOne({
      where: {user_id: parseInt(userId)}
    }).then(function(userDiscounts) {
      var oldRow = JSON.stringify(userDiscounts.dataValues);

      userDiscounts.updateAttributes({
        max_construct: parseFloat(req.body.maxConst),
        max_add_elem: parseFloat(req.body.maxAddEl),
        default_construct: parseFloat(req.body.defaultConst),
        default_add_elem: parseFloat(req.body.defaultAddEl),
        // week_1_construct: parseFloat(req.body.week1Const),
        // week_1_add_elem: parseFloat(req.body.week1AddEl),
        // week_2_construct: parseFloat(req.body.week2Const),
        // week_2_add_elem: parseFloat(req.body.week2AddEl),
        // week_3_construct: parseFloat(req.body.week3Const),
        // week_3_add_elem: parseFloat(req.body.week3AddEl),
        // week_4_construct: parseFloat(req.body.week4Const),
        // week_4_add_elem: parseFloat(req.body.week4AddEl),
        // week_5_construct: parseFloat(req.body.week5Const),
        // week_5_add_elem: parseFloat(req.body.week5AddEl),
        // week_6_construct: parseFloat(req.body.week6Const),
        // week_6_add_elem: parseFloat(req.body.week6AddEl),
        // week_7_construct: parseFloat(req.body.week7Const),
        // week_7_add_elem: parseFloat(req.body.week7AddEl),
        // week_8_construct: parseFloat(req.body.week8Const),
        // week_8_add_elem: parseFloat(req.body.week8AddEl)
      }).then(function(result) {
        res.send({status: true});
        models.users_discounts.findOne({
          where: {user_id: parseInt(userId)}
        }).then(function(userDiscounts) {
          var newRow = JSON.stringify(userDiscounts.dataValues)
          validateNewRecords(userId, 'discounts', oldRow, newRow, req.session.user.id + ' ' + req.session.user.name);
        });
      }).catch(function(err) {
        console.log(err);
        res.send({status: false, error: err});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false, error_1: err});
    });
  });
}

  /** Check max parent Discount */
  function __maxParentDiscout(sessionUser, userId, maxConst, maxAddEl, cb) {
    if (sessionUser.id === parseInt(userId, 10) && sessionUser.user_type === 7) return cb(true);

    models.users_discounts.findOne({
      where: {
        user_id: sessionUser.id
      },
      attributes: ['max_construct', 'max_add_elem']
    }).then(function(parentDiscounts) {
      // if (parseFloat(maxConst) > parseFloat(parentDiscounts.max_construct)) return cb(false, parentDiscounts.max_construct);
      // if (parseFloat(maxAddEl) > parseFloat(parentDiscounts.max_add_elem)) return cb(false, parentDiscounts.max_add_elem);

      cb(true);
    }).catch(function(err) {
      console.log(err);
      cb(false);
    });
  }
