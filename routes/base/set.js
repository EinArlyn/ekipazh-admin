var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var i18n = require('i18n');

var loadImage = require('../../lib/services/imageLoader').loadImage;
var models = require('../../lib/models');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;
var util = require('util');

router.get('/:id', isAuthenticated, getSet);
router.post('/save/:id', isAuthenticated, saveSet); // save set
router.get('/item/get_element_group', isAuthenticated, getElementGroups); // get groups of elements [ajax]
router.get('/item/get_set_group', isAuthenticated, getSetGroups); // get groups of sets [ajax]
router.get('/item/get_elements/:id', isAuthenticated, getElements); // get elements of selected group [ajax]
router.get('/item/get_sets/:id', isAuthenticated, getSets); // get sets of selected group [ajax]
router.post('/item/add_new/:id', isAuthenticated, addNewItemToSet) // add new item to set [ajax]
router.get('/item/get_hardware_colors', isAuthenticated, getHardwareColors); // get all window hardware colors [ajax]
router.get('/item/get_lamination_types', isAuthenticated, getLaminationTypes); // get all lamination types [ajax]
router.post('/contents/removeItem', isAuthenticated, removeItem);
router.get('/item/get/:id', isAuthenticated, getItem);
router.post('/item/edit', isAuthenticated, editItem);
router.post('/saveBeedWidths/:id', isAuthenticated, saveBeedWidths);
router.post('/save-additional-folder/:id', isAuthenticated, saveAddtionalFolder);
router.post('/save-additional-color/:id', isAuthenticated, saveAddtionalColor);
router.get('/is-push/:id/:groupId', isAuthenticated, checkListAvalabilityAsPush);

function getSet (req, res) {
  var id = req.params.id;
  models.lists.findOne({
    where: {id: id},
    include: [{ model: models.lists_groups},
              { model: models.lists_types},
              //{ model: models.list_contents, where: {parent_list_id: id}},
              { model: models.elements},
              { model: models.beed_profile_systems, include: [{model: models.profile_systems}]}
  ]}).then(function (list) {
      models.elements.findOne({
        where: {id: list.parent_element_id}
      }).then(function(parent_element) {
        /** Filter all included items in set */
        models.list_contents.findAll({
          where: {parent_list_id: id}
        }).then(function(list_contents) {

          var filteredElements = [];
          var filteredSets = [];

          list_contents.filter(function(child) {
            if (child.child_type === 'element') {
              filteredElements.push(child.child_id);
            } else if (child.child_type === 'list') {
              filteredSets.push(child.child_id);
            }
          });
          filteredSets.push(-1);
          filteredElements.push(-1);
          models.elements.findAll({
            where: {id: {in: filteredElements}},
            include: {model: models.list_contents, where: {parent_list_id: id}, include: {model: models.rules_types}}
          }).then(function (elementsChilds) {   // all included elements in set
            models.lists.findAll({
              where: {id: {in: filteredSets}},
              include: {model: models.list_contents, where: {parent_list_id: id}, include: {model: models.rules_types}}
            }).then(function (listsChilds) {           // all included sets in set
            // models.sequelize.query('SELECT L.id, L.name, LC.rules_type_id, LC.value, LC.id as LS_id, RT.name as RT_name ' +
            //   'FROM lists L ' +
            //     'JOIN list_contents LC ' +
            //     'ON L.id = LC.child_id ' +
            //       'JOIN rules_types RT ' +
            //       'ON LC.rules_type_id = RT.id ' +
            //   'WHERE L.id IN (' + filteredSets + ')' +
            // '').then(function(listsChilds) {
              models.lists_groups.findAll({
                order: 'name'
              }).then(function (lists_groups) {
                models.lists_types.findAll({
                  order: 'name'
                }).then(function (lists_types) {
                  models.addition_folders.findAll({
                    where: {factory_id: req.session.user.factory_id, addition_type_id: 8}
                  }).then(function(windowSillsFolders) {
                    models.addition_folders.findAll({
                      where: {factory_id: req.session.user.factory_id, addition_type_id: 9}
                    }).then(function(spillwaysFolders) {
                      models.addition_folders.findAll({
                        where: {factory_id: req.session.user.factory_id, addition_type_id: 21}
                      }).then(function(visorsFolders) {
                        models.addition_folders.findAll({
                          where: {factory_id: req.session.user.factory_id, addition_type_id: 7}
                        }).then(function(connectorsFolders) {
                          // models.addition_folders.findAll({
                          //   where: {factory_id: req.session.user.factory_id, addition_type_id: 12}
                          // }).then(function(mosquitosFolders) {
                            models.addition_folders.findAll({
                              where: {factory_id: req.session.user.factory_id, addition_type_id: 10}
                            }).then(function(doorhandlesFolders) {
                              models.window_hardware_handles.find({
                                where: {list_id: id}
                              }).then(function(hardwareHandles) {
                                models.lamination_factory_colors.findAll({
                                  where: {
                                    factory_id: req.session.user.factory_id
                                  }
                                }).then(function(factoryLaminations) {
                                  models.addition_colors.findAll({ where: {lists_type_id: 24}
                                  }).then(function(handlesColors) {
                                    models.addition_colors.findAll({ where: {lists_type_id: 32}
                                    }).then(function(windowSillsColors) {
                                      models.addition_colors.findAll({ where: {lists_type_id: 33}
                                      }).then(function(spillwaysColors) {

                                        res.render('base/set', {
                                          i18n               : i18n,
                                          title              : i18n.__('Edit set'),
                                          list               : list,
                                          parent_element     : parent_element,
                                          lists_groups       : lists_groups,
                                          lists_types        : lists_types,
                                          elementsChilds     : elementsChilds,
                                          listsChilds        : listsChilds,
                                          windowSillsFolders : windowSillsFolders,
                                          spillwaysFolders   : spillwaysFolders,
                                          visorsFolders      : visorsFolders,
                                          connectorsFolders  : connectorsFolders,
                                          // mosquitosFolders   : mosquitosFolders,
                                          doorhandlesFolders : doorhandlesFolders,
                                          handlesColors      : handlesColors,
                                          windowSillsColors  : windowSillsColors,
                                          spillwaysColors    : spillwaysColors,
                                          hardwareHandles    : hardwareHandles,
                                          factoryLaminations : factoryLaminations,
                                          thisPageLink       : '/base/set/',
                                          cssSrcs            : ['/assets/stylesheets/base/set.css'],
                                          scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/vendor/imagePicker/image-picker.min.js', '/assets/javascripts/base/set.js']
                                        });
                                      }).catch(function(error) {
                                        console.log(error);
                                        res.send('Internal sever error.');
                                      });
                                    });
                                    // console.log('LIST',list)
                                    // console.log('>>>><<<<<<<<',doorhandlesFolders);
                                  
                                  // models.lock_lists.findAll({
                                  //   where: {
                                  //     list_id: id
                                  //   },
                                  //   include: [{
                                  //     model: models.lists
                                  //   }]
                                  // }).then(function (lockLists) {
                                    // models.sequelize.query('SELECT L.id, L.name ' +
                                    //   'FROM lists L ' +
                                    //     'JOIN elements E ' +
                                    //     'ON L.parent_element_id = E.id ' +
                                    //   'WHERE E.factory_id=' + parseInt(req.session.user.factory_id) + ' ' +
                                    //     'AND L.list_type_id IN (35, 36)' +
                                    // '').then(function (availableLockLists) {
                                     
                                  //   }).catch(function (error) {
                                  //     console.log(error);
                                  //     res.send('Internal server error.');
                                  //   });
                                  // }).catch(function (error) {
                                  //   console.log(error);
                                  //   res.send('Internal server error.');
                                  // });
                                });
                                });
                              });
                            // });
                          });
                        });
                      });
                    });
                  });
                });
              });
            }).catch(function(err) {
              console.log(err);
              res.send('Internal sever error.');
            });
          });
        });
      });
    });
}

function saveSet(req, res) {
  //console.log(req.body);
  var id = req.params.id;
  var form = new formidable.IncomingForm();
  var lastLocation = '';

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    lastLocation = fields.last_location;
    models.lists.find({ where: {id: id} }).then(function (set) {
      var isPush = fields.is_push ? 1 : 0;

      set.updateAttributes({
        name                : fields.list_name,
        list_group_id       : parseInt(fields.list_group),
        list_type_id        : parseInt(fields.list_type),
        a                   : parseFloat(fields.a),
        b                   : parseFloat(fields.b),
        c                   : parseFloat(fields.c),
        d                   : parseFloat(fields.d),
        e                   : parseFloat(fields.e),
        position            : parseInt(fields.position),
        amendment_pruning   : parseFloat(fields.amendment_pruning),
        waste               : parseFloat(fields.waste),
        size                : parseFloat(fields.size),
        link                : fields.link,
        description         : fields.description,
        beed_lamination_id  : parseInt(fields.lamination_in, 10),
        in_door             : parseInt(fields.in_door, 10) || 0,
        doorstep_type       : parseInt(fields.doorstep_type, 10) || 1,
        glass_type          : parseInt(fields.glass_type, 10) || 1,
        glass_image         : parseInt(fields.glass_image, 10) || 1,
        is_push             : isPush,
        glass_color         : parseInt(fields.glass_color, 10)
      }).then(function (result) {
        if (lastLocation.length) {
          res.redirect(lastLocation);
        } else {
          res.redirect('/base/sets');
        }

        /** Save window hardware handles for lists */
        models.window_hardware_handles.findOne({
          where: {list_id: id}
        }).then(function (result) {
          if (result) {
            console.log('Exist hardwareHandles');
            result.updateAttributes({
              location         : fields.hardware_location,
              constant_value   : parseFloat(fields.furniture_const)
            }).then(function(done) {
              // Done.
            });
          } else {
            console.log('Not exist hardwareHandles');
            models.window_hardware_handles.create({
              list_id          : id,
              location         : fields.hardware_location,
              constant_value   : parseFloat(fields.furniture_const)
            }).then(function () {
              // Done.
            });
          }
        });

        if (files.set_img.name) {
          var url = '/local_storage/set/' + Math.floor(Math.random()*10000) + files.set_img.name;
          loadImage(files.set_img.path, url);
          __saveSetImg(id, url);
        }
      }).catch(function (error) {
        console.log(error);
        res.redirect('/base/set/' + id);
      });
    });
  });
}

    function __saveSetImg (setId, url) {
      models.lists.findOne({
        where: {id: setId}
      }).then(function(set) {
        set.updateAttributes({
          img: url
        });
      });
    }

function getElementGroups(req, res) {
  var groups = req.query.groups;
  var groupsArr = groups.split(',');

  models.elements_groups.findAll({
    where: {id: {in: groupsArr}},
    order: 'name'
  }).then(function (elements_groups) {
    res.send(elements_groups);
  });
}

function getSetGroups(req, res) {
  var groups = req.query.groups;
  var groupsArr = groups.split(',');

  models.lists_groups.findAll({
    where: {id: {in: groupsArr}},
    order: 'name'
  }).then(function (lists_groups) {
    res.send(lists_groups);
  });
}

function getElements(req, res) {
  var groupId = req.params.id;
  var query = req.query.tquery;

  models.sequelize.query("SELECT * FROM elements " +
                         "WHERE factory_id=" + parseInt(req.session.user.factory_id) +
                         " AND element_group_id=" + parseInt(groupId) +
                         " AND UPPER(name) LIKE UPPER('%" + query + "%')" +
                         " ORDER BY name" +
    "").then(function(elements) {
  //models.elements.findAll({ where: {element_group_id: groupId, factory_id: req.session.user.factory_id} }).then(function (elements) {
    res.send(elements[0]);
  });
}

function getSets(req, res) {
  var groupId = req.params.id;
  var query = req.query.tquery;

  models.sequelize.query("SELECT L.id, L.name FROM lists L " +
                          "JOIN elements E " +
                          "ON L.parent_element_id = E.id " +
                         "WHERE E.factory_id=" + parseInt(req.session.user.factory_id) +
                         " AND L.list_group_id=" + parseInt(groupId) +
                         " AND UPPER(L.name) LIKE UPPER('%" + query + "%')" +
                         " ORDER BY name" +
    "").then(function(sets) {
      res.send(sets[0]);
    });
}

function addNewItemToSet(req, res) {
  var setId = req.params.id;

  models.list_contents.create({
    parent_list_id: parseInt(setId),
    child_id : parseInt(req.body.child_id),
    child_type : req.body.child_type,
    value : parseFloat(req.body.value.replace(',', '.')),
    rules_type_id : parseInt(req.body.rules_type_id),
    direction_id : parseInt(req.body.direction_id),
    window_hardware_color_id : parseInt(req.body.window_hardware_color_id),
    lamination_type_id : parseInt(req.body.lamination_type_id),
    modified : new Date(),
    rounding_type: parseInt(req.body.item_rounding_type, 10),
    rounding_value: parseFloat(req.body.item_rounding_value)
  }).then(function() {
    res.send(setId);
  });
}

function getHardwareColors (req, res) {
  models.window_hardware_colors.findAll().then(function (hardware_colors) {
    res.send(hardware_colors);
  });
}

function getLaminationTypes (req, res) {
  models.lamination_types.findAll().then(function (lamination_types) {
    res.send(lamination_types);
  });
}

/** remove element/set from list_contents */
function removeItem(req, res) {
  var itemId = req.body.itemId;
  var parentId = req.body.parentId;
  var contentsId = req.body.contentsId;

  //console.log('CONTENTS: ' + contentsId);
  //console.log('PARENT: ' + parentId);
  //console.log('ITEM: ' + itemId);
  models.list_contents.findOne({
    where: {id: contentsId, child_id: itemId, parent_list_id: parentId}
  }).then(function(child) {
    child.destroy().then(function(result) {
      res.send({status: true});
    }).catch(function(err) {
      res.send({status: false});
    });
  });
}

/** get child item from list_contents */
function getItem (req, res) {
  var itemId = req.params.id;

  models.window_hardware_colors.findAll().then(function (windowHardwareColors) {
    models.lamination_types.findAll().then(function (laminationTypes) {
      models.list_contents.findOne({
        where: {id: itemId},
        attributes: ['id', 'value', 'rules_type_id', 'direction_id', 'window_hardware_color_id', 'lamination_type_id', 'rounding_type', 'rounding_value']
      }).then(function (child) {
        res.send({
          child: child,
          windowHardwareColors: windowHardwareColors,
          laminationTypes: laminationTypes
        });
      }).catch(function (error) {
        console.log(error);
      });
    });
  });
}

function editItem (req, res) {
  //console.log(req.body);
  var childId = req.body.childId;

  models.list_contents.findOne({
    where: {id: childId}
  }).then(function (child) {
    child.updateAttributes({
      value: parseFloat(req.body.value.replace(',', '.')),
      rules_type_id: parseInt(req.body.ruleId),
      direction_id: parseInt(req.body.directionId),
      window_hardware_color_id: parseInt(req.body.hardwareColorId),
      lamination_type_id: parseInt(req.body.profileColorId),
      rounding_type: parseInt(req.body.roundingType, 10),
      rounding_value: parseFloat(req.body.roundingValue)
    }).then(function (result) {
      res.send({status: true});
    });
  });
}

function saveBeedWidths(req, res) {
  var beedWidth = req.body.beeds_widths;
  var listId = req.params.id;

  if (beedWidth) {
    //for (var i = 0, len = beedWidth.length; i < len; i++) {
      __saveBeedWidths(JSON.parse(beedWidth), listId);
    //}
  }

  res.send({status: true});
}

  function __saveBeedWidths(beed, listId) {
    //console.log(beed, listId);
    models.beed_profile_systems.findOne({
      where: {list_id: listId, profile_system_id: beed.profileSystemId}
    }).then(function(result) {
      result.updateAttributes({
        glass_width: parseInt(beed.beedWidth)
      }).then(function() {
        // Done.
      }).catch(function(error) {
        console.log(error);
      });
    }).catch(function(error) {
      console.log(error);
    });
  }

function saveAddtionalFolder(req, res) {
  var setId = req.params.id;
  var folderId = req.body.folderId;

  models.lists.findOne({
    where: { id: setId }
  }).then(function(set) {
    set.updateAttributes({
      addition_folder_id: parseInt(folderId)
    });
    res.end();
  }).catch(function(err) {
    console.log(err);
    res.end();
  });
}
function saveAddtionalColor(req, res) {
  var setId = req.params.id;
  var colorId = req.body.colorId;

  models.lists.findOne({
    where: { id: setId }
  }).then(function(set) {
    set.updateAttributes({
      add_color_id: parseInt(colorId)
    });
    res.end();
  }).catch(function(err) {
    console.log(err);
    res.end();
  });
}

function checkListAvalabilityAsPush (req, res) {
  var listId = req.params.id;
  var groupId = req.params.groupId;

  models.sequelize.query('SELECT L.id, L.name ' +
    'FROM lists L ' +
      'JOIN elements E ' +
      'ON L.parent_element_id = E.id ' +
    'WHERE E.factory_id=' + parseInt(req.session.user.factory_id) + ' ' +
      'AND L.list_group_id = ' + groupId + ' ' +
      'AND L.id != ' + listId + ' ' +
      'AND L.is_push = 1' +
  '').then(function (lists) {
    console.log(lists)
    if (lists && lists[0] && lists[0][0]) return res.send({
      status: true,
      isAvailable: false,
      message: i18n.__('Unavailable Push') + ' ' + lists[0][0].name
    });

    res.send({ status: true, isAvailable: true });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
}

// function addAccessoryToList (req, res) {
//   var accessoryId = req.body.accessoryId;
//   var listId = req.body.listId;
//
//   models.lock_lists.create({
//     list_id: parseInt(listId, 10),
//     accessory_id: parseInt(accessoryId, 10),
//     modified: new Date()
//   }).then(function (newLockSet) {
//     res.send({ status: true, id: newLockSet.id });
//   }).catch(function (error) {
//     console.log(error);
//     res.send({ status: false });
//   })
// }
//
// function removeAccessory (req, res) {
//   var accessoryId = req.body.accessoryId;
//   var id = req.body.id;
//
//   models.lock_lists.destroy({
//     where: {
//       id: parseInt(id, 10),
//       accessory_id: parseInt(accessoryId, 10)
//     }
//   }).then(function () {
//     res.send({ status: true });
//   }).catch(function (error) {
//     console.log(error);
//     res.send({ status: false });
//   });
// }

module.exports = router;
