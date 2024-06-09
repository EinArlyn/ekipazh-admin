var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var i18n = require('i18n');
var async = require('async');

var loadImage = require('../../lib/services/imageLoader').loadImage;
var models = require('../../lib/models');
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;
var util = require('util');

var ITEMS_PER_PAGE = 20;
/** Погонажные изделия */
var LINEAR_ELEMENT = [3, 5];
var LINEAR_SET = [7, 22, 4, 21, 10, 19, 9, 8, 2, 13, 12, 25, 5];

router.get('/', isAuthenticated, getHardwares);
// router.get('/getFeatures/:id', isAuthenticated, getFeatures);
router.get('/get-group-elements', isAuthenticated, getGroupElements);
router.get('/get-elements-groups', isAuthenticated, getElementsGroups);
router.get('/get-hardware-colors', isAuthenticated, getHardwareColors);
router.get('/get-lists-group', isAuthenticated, getListsGroup);
router.get('/get-elements-of-group/:id', isAuthenticated, getElementsOfGroup);
router.get('/get-lists-of-group/:id', isAuthenticated, getListsOfGroup);
router.post('/add-element', isAuthenticated, addElement);
// router.get('/getCountries', isAuthenticated, getCountries);
// router.post('/addFeature', isAuthenticated, addFeature);
router.get('/get-group/:id', isAuthenticated, getGroup);
router.post('/edit-group', isAuthenticated, editGroup);
router.post('/add-hardware-folder', isAuthenticated, addHardwareFolder);
router.get('/get-hardware/:id', isAuthenticated, getHardware);
router.post('/edit-hardware', isAuthenticated, editHardware);
router.post('/delete-hardware', isAuthenticated, deleteHardware);
router.get('/getHardwareFolder/:id', isAuthenticated, getHardwareFolder);
router.post('/editHardwareFolder', isAuthenticated, editHardwareFolder);
router.get('/type-options/:id/:group', isAuthenticated, getTypeOptions);
router.post('/edit-type', isAuthenticated, editHardwareType);
// router.post('/removeFeature', isAuthenticated, removeFeature);
// router.post('/removeFeatureFromGroup', isAuthenticated, removeFeatureFromGroup);
router.get('/get-groups-from-default', isAuthenticated, getGroupsFromDefault);
router.post('/add-group-to-group', isAuthenticated, addGroupToFolder);
router.post('/remove-hardware-folder', isAuthenticated, removeHardwareFolder);
router.get('/is-push/:id', isAuthenticated, isHardwareGroupAvailableAsPush);
router.post('/getHardwareProfile/:id', isAuthenticated, getHardwareProfile);

/**  */
function getHardwareProfile (req, res) {
  var groupId	= parseInt(req.params.id);
  var obj = Object.assign({},req.body);
  for (const property in obj) {
    if (obj[property] == 1)
    {
       _saveProfileSystem(property, groupId);
//       console.log('_saveProfileSystem :' + property + '->' +groupId);
    }
    else
    {
       _destroyProfileSystem(property, groupId);
//       console.log('_destroyProfileSystem :' + property + '->' +groupId);
    }
  }
  models.sequelize.query("SELECT PS.profile_system_id, PS.window_hardware_group_id " +
                         "FROM window_hardware_profile_systems PS " +
                         "JOIN profile_systems E " +
                         "ON PS.profile_system_id = E.id " +
                         "JOIN profile_system_folders F " +
                         "ON E.folder_id = F.id " +
                         "WHERE PS.window_hardware_group_id = " + parseInt(groupId) +
                         " AND F.factory_id = " + parseInt(req.session.user.factory_id) +
  "").then(function (window_hardware_profile_systems) {
      var rows =  window_hardware_profile_systems[0];
      var whps =  {};
      for (var i = 0, len = rows.length; i < len; i++) {
    whps[rows[i].profile_system_id]=rows[i].window_hardware_group_id;
      };
    console.log(whps);
    res.send(whps);
  });
}

/** Is addition folder is available as a Push popup */
function isHardwareGroupAvailableAsPush (req, res) {
  /** window_hardware_groups */
  models.sequelize.query("" +
  "SELECT G.id, G.name, G.is_push " +
   "FROM window_hardware_groups G " +
   "JOIN window_hardware_folders F " +
   "ON G.folder_id = F.id " +
   "WHERE F.factory_id = " + req.session.user.factory_id + " AND G.is_push = 1" +
  "").then(function(window_hardware_groups) {
    var groups = window_hardware_groups[0].filter(function (group) {
      return group.id != req.params.id;
    });

    if (groups && groups.length) return res.send({
      status: true,
      isAvailable: false,
      message: i18n.__('Unavailable Push') + ' ' + groups[0].name
    });

    res.send({ status: true, isAvailable: true });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
}

/** Get hardware folders with groups */
function getHardwares (req, res) {
  models.profile_systems.findAll({
    include: [{
      model: models.profile_system_folders,
      where: { factory_id: req.session.user.factory_id }
    }],
    order: ['id']
    }).then(function (profile_systems) {
      models.window_hardware_folders.findOne({
        where: {factory_id: req.session.user.factory_id, name: 'Default'},
        include: [{model: models.window_hardware_groups, order: ['name']}]
      }).then(function (defaultFolder) {
        models.window_hardware_folders.findAll({
          where: {factory_id: req.session.user.factory_id, id: {$ne: parseInt(defaultFolder.id)}},
          order: ['id'],
          include: [{model: models.window_hardware_groups, order: ['name']}]
        }).then(function (hardwareFolders) {
          models.filter_furnitures.findOne({
            where: {
              factory_id: req.session.user.factory_id
            }
          }).then((filterData) => {
            res.render('base/hardware', {
            title               : i18n.__('Hardware'),
            i18n                : i18n,
            hardwareFolders     : hardwareFolders,
            defaultFolder       : defaultFolder,
            filterData          : filterData,
            profile_systems     : profile_systems,
            additionalFilters   : {},
            thisPageLink        : '/base/hardware/',
            cssSrcs             : ['/assets/stylesheets/base/hardware.css'],
            scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/hardware.js']
          });
        });
      });
    });
  }).catch(function(err) {
    console.log(err);
    res.end();
  });
}

/** Get hardware folders with groups */
//function getHardwares (req, res) {
//  models.window_hardware_folders.findOne({
//    where: {factory_id: req.session.user.factory_id, name: 'Default'},
//    include: [{model: models.window_hardware_groups, order: 'name'}]
//  }).then(function (defaultFolder) {
//    models.window_hardware_folders.findAll({
//      where: {factory_id: req.session.user.factory_id, id: {$ne: parseInt(defaultFolder.id)}},
//      order: 'id',
//      include: [{model: models.window_hardware_groups, order: 'name'}]
//    }).then(function (hardwareFolders) {
//      res.render('base/hardware', {
//        title               : i18n.__('Hardware'),
//        i18n                : i18n,
//        hardwareFolders     : hardwareFolders,
//        defaultFolder       : defaultFolder,
//        thisPageLink        : '/base/hardware/',
//        cssSrcs             : ['/assets/stylesheets/base/hardware.css'],
//        scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/hardware.js']
//      });
//    });
//  }).catch(function(err) {
//    console.log(err);
//    res.end();
//  });
//}

function getFeatures (req, res) {
  var id = req.params.id;

  models.window_hardware_features.findAll({
    where: {hardware_group_id: id, factory_id: req.session.user.factory_id},
    //include: [{model: models.countries}]
  }).then(function (features) {
    console.log(features);
    res.send(features);
  });
}

function getGroupElements (req, res) {
  var folderId = req.query.folderId;
  var windowHardwareTypeId = req.query.windowHardwareTypeId || 2;
  var page = parseInt(req.query.page);
  var groupId = req.query.groupId;
  var offset = page * ITEMS_PER_PAGE;

  models.window_hardwares.findAndCountAll({
    where: {
      window_hardware_group_id: parseInt(groupId),
      factory_id: parseInt(req.session.user.factory_id),
      window_hardware_type_id: parseInt(windowHardwareTypeId),
      //window_hardware_feature_id: parseInt(groupId)
    },
    include: [{model: models.directions}, {model: models.lamination_factory_colors, required: false}],
    limit: ITEMS_PER_PAGE,
    order: 'id',
    offset: offset
  }).then(function (featuresElements) {
    /*
      * Filter all included items in set
    */
    var filteredElements = [];
    var filteredSets = [];
    featuresElements.rows.filter(function(child) {
      if (child.child_type === 'element') {
        filteredElements.push(child.child_id);
      } else if (child.child_type === 'list') {
        filteredSets.push(child.child_id);
      }
    });
    models.lists.findAll({
      where: {id: filteredSets}
    }).then(function(listsChilds) {
      models.elements.findAll({
        where: {id: filteredElements}
      }).then(function(elementsChilds) {
        var json = {
          elementsChilds: elementsChilds,
          listsChilds: listsChilds,
          featuresElements: featuresElements.rows,
          totalPages: Math.ceil(featuresElements.count / ITEMS_PER_PAGE),
          currentPage: parseInt(req.query.page || 0)
        };
        res.send(json);
      });
    });
  });
}

function getElementsGroups (req, res) {
  /**
   * Get all groups of elements
   */
  models.elements_groups.findAll().then(function (elementsGroups) {
    res.send(elementsGroups);
  });
}

function getHardwareColors (req, res) {
  /** Get all hardwares colors */
  // models.window_hardware_colors.findAll().then(function (colors) {
  //   res.send(colors);
  // });
  models.lamination_factory_colors.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function function_name (colors) {
    res.send(colors);
  });
}

function getListsGroup (req, res) {
  /**
   * Get all groups of lists
   */
  models.lists_groups.findAll().then(function (listsGroups) {
    res.send(listsGroups);
  });
}

function getElementsOfGroup (req, res) {
  /**
   * Get elements of current group
   * @param {integer} groupId       This is group id
   * @param {integer} factory_id    This is factory id
   */
  var groupId = parseInt(req.params.id);
  var query = req.query.tquery;

  models.sequelize.query("SELECT * FROM elements " +
                         "WHERE factory_id=" + parseInt(req.session.user.factory_id) +
                         " AND element_group_id=" + parseInt(groupId) +
                         " AND UPPER(name) LIKE UPPER('%" + query + "%')" +
                         " ORDER BY name" +
    "").then(function(elements) {
    res.send(elements[0]);
  });
}

function getListsOfGroup (req, res) {
  /**
   * Get lists of current group
   * @param {integer} groupId       This is group id
   * @param {integer} factory_id    This is factory id
   */
  var groupId = parseInt(req.params.id);
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

function addElement (req, res) {
  /**
   * Add element to hardware group
   */
  models.window_hardwares.create({
    window_hardware_type_id: parseInt(req.body.hardwareTypeId),
    min_width: parseInt(req.body.minWidth),
    max_width: parseInt(req.body.maxWidth),
    min_height: parseInt(req.body.minHeight),
    max_height: parseInt(req.body.maxHeight),
    direction_id: parseInt(req.body.directionId),
    window_hardware_color_id: parseInt(req.body.windowHardwareColorId),
    length: parseInt(req.body.length),
    count: parseInt(req.body.count),
    child_id: parseInt(req.body.childId),
    child_type: req.body.childType,
    position: req.body.position,
    factory_id: parseInt(req.session.user.factory_id),
    window_hardware_group_id: parseInt(req.body.hardwareGroupId),
    //window_hardware_feature_id: parseInt(req.body.featureId),
    modified: new Date()
  }).then(function () {
    res.end();
  }).catch(function(err) {
    console.log(err);
  });
}

function getCountries (req, res) {
  /**
   * Get all countries
   */
  models.countries.findAll().then(function (countries) {
    res.send(countries);
  });
}

function addFeature (req, res) {
  /**
   * Add new feature to hardware group
   * @param {integer} hardware_group_id
   * @param {string} name
   * @param {string} producer
   * @param {string} country
   * @param {string} logo_url
   * @param {string} link
   * @param {integer} noise
   * @param {integer} heat_coeff
   * @param {integer} air_coeff
   */
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    var logoUrl = '';

    if (!files.feature_img.name) {
      logoUrl = '/local_storage/hardware/default.png';
    } else {
      logoUrl = '/local_storage/hardware/' + files.feature_img.name;
      saveFeatureLogo(logoUrl);
    }

    models.window_hardware_features.create({
      hardware_group_id : parseInt(fields.hardware_group_id),
      name : fields.feature_name,
      producer : fields.feature_producer,
      country : fields.feature_country,
      logo_url : logoUrl,
      link : null,
      noise : parseInt(fields.feature_noise_coeff),
      heat_coeff : parseInt(fields.feature_heat_coeff),
      air_coeff : null,
      factory_id: req.session.user.factory_id
    }).then(function (result) {
      res.redirect('/base/hardware');
    });

    function saveFeatureLogo(logoUrl) {
      fs.readFile(files.feature_img.path, function(err, data) {
        if (err) console.log('Image upload error. Error: ' + err);
        fs.writeFile(logoUrl, data, function(err) {});
      });
    }
  });

}

/**
 * Get feature with feature_groups
 * @param {integer} id
 */
function getGroup(req, res) {
  models.window_hardware_groups.findOne({
    where: {
      id: parseInt(req.params.id, 10)
    }
  }).then(function (group) {
    models.window_hardware_folders.findAll({
      where: {factory_id: parseInt(req.session.user.factory_id)},
      attributes: ['id', 'name']
    }).then(function (groupFolders) {
      res.send({group: group, groupFolders: groupFolders});
    });
  });
}

/**
 * Edit group
 * @param {integer} id
 * @param {integer} feature_group
 * @param {string}  name
 * @param {string}  producer
 * @param {string}  country
 * @param {string}  logo_url
 * @param {string}  link
 * @param {integer} noise
 * @param {integer} heat_coeff
 * @param {integer} air_coeff
 */
function editGroup (req, res) {
  var imageUrl = null;
  var isPush = 0;
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.window_hardware_groups.find({
      where: {id: fields.feature_id}
    }).then(function (group) {
      if (fields.hardware_by_default && group.is_default === 0) {
        setDefaultHardware(fields.feature_id, req.session.user.factory_id);
      }

      if (fields.is_push) {
        isPush = 1;
      }

      group.updateAttributes({
        name: fields.feature_name,
        producer: fields.feature_producer,
        country: fields.feature_country,
        folder_id: parseInt(fields.feature_group),
        noise_coeff: parseInt(fields.feature_noise_coeff),
        heat_coeff: parseInt(fields.feature_heat_coeff),
        //min_height: parseInt(fields.min_height),
        //max_height: parseInt(fields.max_height),
        //min_width: parseInt(fields.min_width),
        //max_width: parseInt(fields.max_width),
        code_sync: fields.sync_code,
        is_in_calculation: (fields.hardware_active ? parseInt(fields.hardware_active, 10) : 0),
        link: fields.feature_link,
        description: fields.feature_description,
        is_push: isPush
        //air_coeff: parseInt(fields.feature_air_coeff)
      }).then(function (result) {
        setTimeout(function() {
          res.redirect('/base/hardware/');
        }, 300);
      });
    });

    if (files.feature_img.name) {
      fs.readFile(files.feature_img.path, function(err, data) {
        if (err) console.log('Image upload error. Error: ' + err);
        fs.writeFile('./local_storage/hardware/' + files.feature_img.name, data, function(err) {});
        imageUrl = '/local_storage/hardware/' + files.feature_img.name;
        saveFeatureDescription();
      });
    } else {
      saveFeatureDescription();
    }

    function saveFeatureDescription() {
      models.window_hardware_groups.findOne({
        where: {id: fields.feature_id}
      }).then(function (result) {
        if (result) {
          result.updateAttributes({
            img : imageUrl
          }).then(function(done) {
            // Done.
          });
        }
      });
    }

    function setDefaultHardware(hardwareGroupId, factoryId) {
      async.series([
        /** Find default hardware folder */
        function(_callback) {
          models.window_hardware_folders.findAll({
            where: {factory_id: factoryId},
            include: [{model: models.window_hardware_groups, where: {is_default: 1}}],
            attributes: ['id', 'name']
          }).then(function(defaultHardwareFolder) {
            if (defaultHardwareFolder.length) {
              var defaultGroup = defaultHardwareFolder[0].window_hardware_groups[0];

              defaultGroup.updateAttributes({
                is_default: 0
              }).then(function() {
                _callback(null);
              }).catch(function(err) {
                _callback(err);
              });
            } else {
              _callback(null);
            }
          }).catch(function(err) {
            _callback(err);
          });
        },
        /** Set new default hardware group */
        function(_callback) {
          models.window_hardware_groups.find({
            where: {id: hardwareGroupId},
            attributes: ['id', 'is_default', 'name']
          }).then(function(newDefaultHardwareGroup) {
            newDefaultHardwareGroup.updateAttributes({
              is_default: 1
            }).then(function() {
              _callback(null);
            }).catch(function(err) {
              _callback(err);
            });
          });
        }
      ], function(err) {
        if (err) {
          console.log('Error on setting default group: ', err);
        }
        // Done.
      });
    }

  });
}

/**
 * Add new hardware group
 * @param {string} name           Required
 * @param {integer} factory_id    Required
 * @param {string} link
 * @param {string} description
 * @param {string} img
 * @param {date} modified
 */
function addHardwareFolder (req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.window_hardware_folders.create({
      name: fields.name,
      factory_id: parseInt(req.session.user.factory_id),
      link: fields.link,
      description: fields.description,
      img: '',
      modified: new Date()
    }).then(function (result) {
      if (files.hardware_img.name) {
        var url = '/local_storage/hardware/' + Math.floor(Math.random()*1000000) + files.hardware_img.name + '.png';
        loadImage(files.hardware_img.path, url);
        models.window_hardware_folders.findOne({
          where: {id: result.id}
        }).then(function (hwFolder) {
          hwFolder.updateAttributes({
            img: url
          });
          res.redirect('/base/hardware');
        });
      } else {
        res.redirect('/base/hardware');
      }
    });
  });
}

function getHardware (req, res) {
  /**
   * Get window_hardware
   * @param {integer} id
   */

  models.window_hardwares.find({
    where: {id: req.params.id}
  }).then(function (hardware) {
    var type = hardware.child_type;
    if (type === 'list') {
      models.lists.find({
        where: {id: parseInt(hardware.child_id)}
      }).then(function(list) {
        if (LINEAR_SET.indexOf(parseInt(list.list_group_id)) >= 0) {
          res.send({status: true, is_linear: true, hardware: hardware});
        } else {
          res.send({status: true, is_linear: false, hardware: hardware});
        }
      }).catch(function(error) {
        console.log(error);
        res.send({status: false});
      });
    } else {
      models.elements.find({
        where: {id: parseInt(hardware.child_id)}
      }).then(function(element) {
        if (LINEAR_ELEMENT.indexOf(parseInt(element.element_group_id)) >= 0) {
          res.send({status: true, is_linear: true, hardware: hardware});
        } else {
          res.send({status: true, is_linear: false, hardware: hardware});
        }
      }).catch(function(error) {
        console.log(error);
        res.send({status: false});
      });
    }
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function editHardware (req, res) {
  /**
   * Edit hardware
   * @param {integer} id  This is hardware id
   * @param {}
   */

  models.window_hardwares.findOne({
    where: {id: parseInt(req.body.hardwareId)}
  }).then(function (hardware) {
    hardware.updateAttributes({
      min_width: parseInt(req.body.minWidth),
      max_width: parseInt(req.body.maxWidth),
      min_height: parseInt(req.body.minHeight),
      max_height: parseInt(req.body.maxHeight),
      direction_id: parseInt(req.body.directionId),
      window_hardware_color_id: parseInt(req.body.windowHardwareColorId),
      length: parseInt(req.body.length),
      count: parseInt(req.body.count)
    }).then(function (result) {
      res.end();
    });
  });
}

function deleteHardware(req, res) {
  /**
   * Delete hardware
   * @param {integer} id  This is hardware id
   */

  models.window_hardwares.destroy({
    where: {id: parseInt(req.body.hardwareId)}
  }).then(function () {
    res.end();
  });
}

function getHardwareFolder(req, res) {
  /**
   * Get hardware group
   * @param {integer} id
   */

  var groupId = req.params.id;

  models.window_hardware_folders.findOne({
    where: {id: groupId},
    attributes: ['id', 'name', 'link', 'description', 'img']
  }).then(function(hardwareFolder) {
    res.send(hardwareFolder);
  });
}

/**
 * Edit hardware group name
 * @param {integer} id
 * @param {string} name
 * @param {string} link
 * @param {string} description
 * @param {string} img
 */
function editHardwareFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.window_hardware_folders.findOne({
      where: {id: parseInt(fields.folder_id)}
    }).then(function(hardware_group) {
      hardware_group.updateAttributes({
        name: fields.name,
        link: fields.link,
        description: fields.description,
        //img: req.body.hardwareFolderImg
      }).then(function() {
        if (files.hardware_img.name) {
          var url = '/local_storage/hardware/' + Math.floor(Math.random()*1000000) + files.hardware_img.name;
          loadImage(files.hardware_img.path, url);

          models.window_hardware_folders.findOne({
            where: {id: parseInt(fields.folder_id)}
          }).then(function(hardwareGroup) {
            hardwareGroup.updateAttributes({
              img: url
            });
          });
        }
        res.send({status: true});
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

function removeFeatureFromGroup(req, res) {
  /**
   * Remove feature from DB
   * @param {integer} featureId
   */
  var featureId = req.body.featureId;

  models.window_hardware_features.findOne({
    where: {id: featureId, factory_id: req.session.user.factory_id}
  }).then(function(result) {
    result.updateAttributes({
      hardware_group_id: 0
    })
      .then(function() {
        res.send({status: true});
      })
      .catch(function(error) {
        console.dir(error);
        res.send({status: false, error: error});
      });
  });
}

function removeFeature(req, res) {
  /**
   * Remove feature from DB
   * @param {integer} featureId
   */
  var featureId = req.body.featureId;

  models.window_hardware_features.findOne({
    where: {id: featureId, factory_id: req.session.user.factory_id}
  }).then(function(result) {
    result.destroy()
      .then(function() {
        res.send({status: true});
      })
      .catch(function(error) {
        res.send({status: false, error: error});
      });
  });
}

function getGroupsFromDefault(req, res) {
  models.window_hardware_folders.findOne({
    where: {factory_id: req.session.user.factory_id, name: 'Default'},
    attributes: ['id']
  }).then(function(defaultFolder) {
    models.window_hardware_groups.findAll({
      where: {folder_id: parseInt(defaultFolder.id)},
      attributes: ['id', 'name'],
      order: 'name'
    }).then(function (groups) {
      res.send({status: true, groups: groups});
    }).catch(function (error) {
      console.log(error);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Add hardware group to folder
 * @param {integer}  groupId
 * @param {integer}  folderId
 */
function addGroupToFolder(req, res) {
  var groupId = req.body.groupId;
  var folderId = req.body.folderId;

  models.window_hardware_groups.find({
    where: {id: parseInt(groupId)}
  }).then(function (group) {
    group.updateAttributes({
      folder_id: parseInt(folderId)
    }).then(function() {
      res.send({status: true});
    }).catch(function(error) {
      console.log(error);
      res.send({status: false});
    });
  }).catch(function (error) {
    console.log(error);
    res.send({status: false});
  });
}

/**
 * Remove hardware folder
 * @param {integer}  hardwareFolderId
 */
function removeHardwareFolder(req, res) {
  var hardwareFolderId = req.body.hardwareFolderId;

  models.window_hardware_folders.findOne({
    where: {factory_id: req.session.user.factory_id, name: 'Default'},
    attributes: ['id']
  }).then(function(defaultFolder) {
    models.window_hardware_groups.findAll({
      where: {folder_id: hardwareFolderId},
      attributes: ['id', 'folder_id']
    }).then(function(hardwareGroups) {
      /** Set folders to default */
      if (hardwareGroups.length) {
        for (var i = 0, len = hardwareGroups.length; i < len; i++) {
          __removeGroupsFromFolder(hardwareGroups[i], defaultFolder.id);
        }
      }

      models.window_hardware_folders.findOne({
        where: {id: hardwareFolderId}
      }).then(function(hardwareFolder) {
        hardwareFolder.destroy().then(function() {
          res.send({status: true});
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
  });
}

function __removeGroupsFromFolder(group, defaultFolder) {
  group.updateAttributes({
    folder_id: parseInt(defaultFolder)
  });
}

function getTypeOptions(req, res) {
  var id = req.params.id;
  var groupId = req.params.group;
  models.window_hardware_type_ranges.find({
    where: {
      factory_id: req.session.user.factory_id,
      type_id: id,
      group_id: groupId
    }
  }).then(function (type) {
    if (type) return res.send({ status: true, type: type });

    /** According to new TT. */
    models.window_hardware_type_ranges.create({
      factory_id: req.session.user.factory_id,
      type_id: id,
      max_width: 1000,
      min_width: 0,
      max_height: 1000,
      min_height: 0,
      modified: new Date(),
      group_id: groupId
    }).then(function (newType) {
      res.send({ status: true, type: newType });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
}

function editHardwareType(req, res) {
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.window_hardware_type_ranges.find({
      where: {
        factory_id: req.session.user.factory_id,
        type_id: fields.hardware_type_id,
        group_id: fields.hardware_group_id
      }
    }).then(function (type) {
      type.updateAttributes({
        min_height: fields.min_height,
        max_height: fields.max_height,
        min_width: fields.min_width,
        max_width: fields.max_width
      }).then(function () {
        res.send({ status: true });
      }).catch(function (error) {
        res.send({ status: false });
      });
    }).catch(function (error) {
      res.send({ status: false });
    });
  });
}

/**
 * @param {integer} profileId - Profile system Id
 * @param {integer} hardwareId - Hardware Id
 */
function _saveProfileSystem (profileId, hardwareId) {
  /** set profile system for hardware */
  models.window_hardware_profile_systems.findOne({
    where: {
      profile_system_id: profileId,
      window_hardware_group_id: hardwareId
    }
  }).then(function (result) {
    if (result) return;
    models.window_hardware_profile_systems.create({
      profile_system_id: parseInt(profileId, 10),
      window_hardware_group_id: parseInt(hardwareId, 10),
      modified: new Date()
    }).then(function (result) {
      return;
    });
  });
}

/**
 * @param {integer} profileId - Profile system id
 * @param {integer} hardwareId - Hardware id
 */
function _destroyProfileSystem(profileId, hardwareId) {
  models.window_hardware_profile_systems.findOne({
    where: {
      profile_system_id: profileId,
      window_hardware_group_id: hardwareId
    }
  }).then(function (result) {
    if (!result) return;
    result.destroy().then(function () {
      return;
    });
  });
}


module.exports = router;
