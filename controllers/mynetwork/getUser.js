var _ = require('lodash');
var models = require('../../lib/models');


/**
 * Get user info by Id
 * @param {integer}  id
 */
module.exports = function (req, res) {
  var id = req.params.id;

  models.users.findOne({
    where: {id: id}
  }).then(function(user) {
    models.cities.findAll({
      where: {id: user.city_id},
      order: 'name',
      include: [{model: models.regions}]
    }).then(function(userLocation) {
      models.order_folders.findAll({
        where: {
          factory_id: req.session.user.factory_id
        }
      }).then(function (factoryFolders) {
        models.users_accesses.findAll({
          where: {user_id: id}
        }).then(function(userAccess) {
          // (req.session.user.id !== user.parent_id || !req.session.user.is_all_calcs && req.session.user.user_type !== 7)
          if (req.session.user.id !== user.parent_id)
            return sendUser(user, userLocation, userAccess, null, null, null, null, factoryFolders);

          models.users_accesses.findAll({
            where: {
              user_id: req.session.user.id
            },
            attributes: ['menu_id']
          }).then(function(parentAccesses) {
            var mapedParentAccesses = parentAccesses.map(function(access) {
              return access.dataValues.menu_id;
            });
            models.users.findAll({
              where: {parent_id: req.session.user.id, id: {$ne: id}},
              attributes: ['id', 'name']
            }).then(function(childs) {
              if (req.session.user.user_type === 7) return sendUser(user, userLocation, userAccess, childs, null, [{id: req.session.user.id, name: req.session.user.name}], mapedParentAccesses, factoryFolders);

              models.users.find({
                where: {id: req.session.user.parent_id},
                attributes: ['id', 'name']
              }).then(function(userParent) {
                models.users.findAll({
                  where: {parent_id: req.session.user.parent_id},
                  attributes: ['id', 'name']
                }).then(function(neighborhoods) {
                  sendUser(user, userLocation, userAccess, childs, userParent, neighborhoods, mapedParentAccesses, factoryFolders);
                }).catch(function(err) {
                  console.log(err);
                  res.send({status: false});
                });
              }).catch(function(err) {
                console.log(err);
                res.send({status: false});
              });
            }).catch(function(err) {
              console.log(err);
              res.send({status: false});
            });
          }).catch(function(err) {
            console.log(err);
            res.send({status: false});
          });
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      }).catch(function (err) {
        console.log(err);
        res.send({ status: false });
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });

  function sendUser(user, userLocation, userAccess, childs, userParent, neighborhoods, parentAccesses, factoryFolders) {
    res.send({
      status: true,
      user: user,
      userLocation: userLocation,
      userAccess: userAccess,
      childs: _.flatten(childs),
      userParent: userParent,
      neighborhoods: _.flatten(neighborhoods) || [],
      parentAccesses: _.flatten(parentAccesses) || [],
      parentTypes: {
        is_payer: req.session.user.is_payer,
        is_employee: req.session.user.is_employee,
        is_buch: req.session.user.is_buch,
        is_to: req.session.user.is_to,
        is_all_calcs: req.session.user.is_all_calcs
      },
      factoryFolders: factoryFolders
    });
  }
}
