var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var i18n = require('i18n');
var fs = require('fs');

var models = require('../../lib/models');
var loadImage = require('../../lib/services/imageLoader').loadImage;
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;

router.get('/', isAuthenticated, getProfiles);
router.get('/getProfilesOfGroup/:id', isAuthenticated, getProfilesOfGroup);
router.post('/addProfileGroup', isAuthenticated, addProfileGroup);
router.get('/getProfileSystem/:id', isAuthenticated, getProfileSystem);
router.post('/editProfileSystem', isAuthenticated, editProfileSystem);
router.get('/removeProfileGroup/:id', isAuthenticated, removeProfileGroup);
router.get('/getDefaultProfiles', isAuthenticated, getDefaultProfiles);
router.post('/addProfileFromDefault', isAuthenticated, addProfileFromDefault);
router.get('/getProfileGroup/:id', isAuthenticated, getProfileGroup);
router.post('/saveProfileGroup', isAuthenticated, saveProfileGroup);
router.get('/getProfileSystemFolders', isAuthenticated, getProfileSystemFolders);
router.post('/changeList', isAuthenticated, changeList);
router.post('/activate', isAuthenticated, activate);
router.get('/laminations/:id', isAuthenticated, getProfileLaminations);
router.get('/getLaminationDependency', isAuthenticated, getLaminationDependency);
router.post('/submitLaminationDependency', isAuthenticated, submitLaminationDependency);
router.post('/editLaminationDependency', isAuthenticated, editLaminationDependency);
router.get('/is-push/:id', isAuthenticated, isProfileFolderAvailableAsPush);

router.post('/getProfileCountry/:id', isAuthenticated, getProfileCountry);
//router.post('/addNewProfileSystem', addNewProfileSystem);
//router.post('/removeProfileSystem', removeProfileSystem);

function isProfileFolderAvailableAsPush (req, res) {
  models.sequelize.query("" +
  "SELECT PS.id, PS.name, PS.is_push " +
   "FROM profile_systems PS " +
   "JOIN profile_system_folders F " +
   "ON PS.folder_id = F.id " +
   "WHERE F.factory_id = " + req.session.user.factory_id + " AND PS.is_push = 1" +
  "").then(function(profileSystems) {
    var groups = profileSystems[0].filter(function (group) {
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

/** Main page of profile systems. Get profiles systems with groups */
function getProfiles(req, res) {
    models.sequelize.query(`WITH country_ids AS (
    SELECT 
        ps.id AS profile_system_id, 
        json_agg(cps.country_id) AS country_ids
    FROM 
        "profile_systems" ps
    LEFT JOIN 
        "compliance_profile_systems" cps 
    ON 
        cps.profile_system_id = ps.id
    GROUP BY 
        ps.id
)
SELECT 
    psf.id, 
    psf.name, 
    json_agg(
        json_build_object(
            'id', ps.id,
            'name', ps.name,
            'cameras', ps.cameras,
            'country', ps.country,
            'heat_coeff', ps.heat_coeff,
            'noise_coeff', ps.noise_coeff,
            'rama_list_id', ps.rama_list_id,
            'rama_still_list_id', ps.rama_still_list_id,
            'stvorka_list_id', ps.stvorka_list_id,
            'impost_list_id', ps.impost_list_id,
            'impost_in_stvorka_list_id', ps.impost_in_stvorka_list_id,
            'shtulp_list_id', ps.shtulp_list_id,
            'code_sync_white', ps.code_sync_white,
            'country_ids', ci.country_ids
        )
    ) AS profile_systems
FROM 
    "profile_system_folders" psf
LEFT OUTER JOIN 
    "profile_systems" ps 
ON 
    psf.id = ps.folder_id
LEFT OUTER JOIN 
    country_ids ci 
ON 
    ps.id = ci.profile_system_id
WHERE 
    psf.factory_id = ${req.session.user.factory_id}
GROUP BY 
    psf.id, psf.name;
`).then(function(profileSystemFolders) {
    models.sequelize.query("SELECT L.id, L.name " +
                             "FROM lists L " +
                             "JOIN elements E " +
                             "ON L.parent_element_id = E.id " +
                             "JOIN lists_groups LG " +
                             "ON L.list_group_id = LG.id " +
                             "WHERE E.factory_id = " + req.session.user.factory_id + " AND L.list_type_id = 5" +
    "").then(function(frameLists) {
      models.sequelize.query("SELECT L.id, L.name " +
                               "FROM lists L " +
                               "JOIN elements E " +
                               "ON L.parent_element_id = E.id " +
                               "JOIN lists_groups LG " +
                               "ON L.list_group_id = LG.id " +
                               "WHERE E.factory_id = " + req.session.user.factory_id + " AND L.list_type_id = 34" +
      "").then(function(frameWithSillLists) {
        models.sequelize.query("SELECT L.id, L.name " +
                                 "FROM lists L " +
                                 "JOIN elements E " +
                                 "ON L.parent_element_id = E.id " +
                                 "JOIN lists_groups LG " +
                                 "ON L.list_group_id = LG.id " +
                                 "WHERE E.factory_id = " + req.session.user.factory_id + " AND L.list_type_id = 3" +
        "").then(function(impostLists) {
          models.sequelize.query("SELECT L.id, L.name " +
                                   "FROM lists L " +
                                   "JOIN elements E " +
                                   "ON L.parent_element_id = E.id " +
                                   "JOIN lists_groups LG " +
                                   "ON L.list_group_id = LG.id " +
                                   "WHERE E.factory_id = " + req.session.user.factory_id + " AND L.list_type_id = 9" +
          "").then(function(shtulpLists) {
            models.sequelize.query("SELECT L.id, L.name " +
                                     "FROM lists L " +
                                     "JOIN elements E " +
                                     "ON L.parent_element_id = E.id " +
                                     "JOIN lists_groups LG " +
                                     "ON L.list_group_id = LG.id " +
                                     "WHERE E.factory_id = " + req.session.user.factory_id + " AND L.list_type_id IN (6,7)" +
            "").then(function(leafs) {
              models.countries.findAll({
                attributes: ["id", "name"]
              }).then(function(countries) {                                     
                  res.render('base/profiles', {
                    i18n                 : i18n,
                    title                : i18n.__('Profiles'),
                    profileSystemFolders : profileSystemFolders[0],
                    frameLists           : frameLists,
                    frameWithSillLists   : frameWithSillLists,
                    impostLists          : impostLists,
                    shtulpLists          : shtulpLists,
                    countries            : countries,
                    leafs                : leafs,
                    cssSrcs              : ['/assets/stylesheets/base/index.css', '/assets/stylesheets/base/profiles.css'],
                    scriptSrcs           : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/profiles.js']
                  });
              });
            });
          });
        });
      });
    });
  }).catch(function(error) {
    console.log(error);
  });
}

/**
 * Get profiles system of current group
 * @param {integer} id    This is group id
 */
function getProfilesOfGroup(req, res) {
  var profileGroupId = req.params.id;

  models.profile_systems.findAll({
    where: {profile_system_group_id: parseInt(profileGroupId)}
  }).then(function(profileSystems) {
    res.send({status: true, profileSystems: profileSystems});
  }).catch(function(error) {
    res.send({status: false});
  });
}

function addProfileGroup(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.profile_system_folders.create({
      name: fields.name,
      factory_id: parseInt(req.session.user.factory_id, 10),
      position: parseInt(fields.position, 10) || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: ''
    }).then(function(result) {
      if (files.group_img.name) {
        var url = '/local_storage/profiles/' + Math.floor(Math.random() * 1000000) + files.group_img.name;
        loadImage(files.group_img.path, url);

        models.profile_system_folders.findOne({
          where: {id: parseInt(result.id)}
        }).then(function(profileGroup) {
          profileGroup.updateAttributes({
            img: url
          });
        });
      }
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });
}

/**
 * Get current profiles system with aviable groups
 * @param {integer} id   This is profile system id
 */
function getProfileSystem(req, res) {
  var profileSystemId = req.params.id;

  models.profile_systems.find({
    where: {id: profileSystemId}
  }).then(function(profileSystem) {
    models.profile_system_folders.findAll({
      where: {factory_id: req.session.user.factory_id}
    }).then(function(profileSystemGroups) {
      res.send({
        status: true,
        profileSystem: profileSystem,
        profileSystemGroups: profileSystemGroups
      });
    }).catch(function(error) {
      res.send({status: false});
    });
  }).catch(function(error) {
    res.send({status: false});
  });
}

/**
 * Edit profile system
 * @param {integer}  profileSystemId
 * @param {integer}  profileSystemGroupId
 * @param {string}   profileSystemName
 */
function editProfileSystem(req, res) {
  var form = new formidable.IncomingForm();
  var isDefault = 0;
  var isPush = 0;
  var imageUrl = '';

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (fields.profile_by_default) {
      isDefault = 1;
      _unselectDefaultProfileSystem(fields.profile_system_id, req.session.user.factory_id);
    }

    if (fields.is_push) {
      isPush = 1;
    }

    models.profile_systems.find({
      where: {id: fields.profile_system_id}
    }).then(function(profileSystem) {
      profileSystem.updateAttributes({
        name: fields.name,
        position: parseInt(fields.position, 10),
        folder_id: parseInt(fields.folder_id, 10),
        cameras: parseInt(fields.cameras, 10),
        country: fields.country,
        heat_coeff: parseInt(fields.heat_coeff, 10),
        heat_coeff_value: parseFloat(fields.heat_coeff_value),
        noise_coeff: parseInt(fields.noise_coeff, 10),
        is_default: isDefault,
        link: fields.link,
        description: fields.description,
        code_sync: fields.sync_code,
        is_push: isPush
      }).then(function() {
        if (files.profile_img.name) {
          fs.readFile(files.profile_img.path, function(err, data) {
            if (err) console.log('Image upload error. Error: ' + err);
            imageUrl = '/local_storage/profiles/' + Math.floor(Math.random()*1000000) + files.profile_img.name;
            fs.writeFile('.' + imageUrl, data, function(err) {});
            __saveProfileImg(fields.profile_system_id, imageUrl);
          });
        }
        res.send({status: true});
      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    });
  });

  function __saveProfileImg(id, url) {
    models.profile_systems.find({
      where: {id: id}
    }).then(function(profileSystem) {
      profileSystem.updateAttributes({
        img: url
      });
    });
  }
}

  function _unselectDefaultProfileSystem(profileSystemId, factoryId) {
    models.profile_system_folders.findAll({
      where: {
        factory_id: factoryId
      },
      include: {
        model: models.profile_systems,
        where: {id: {$ne: profileSystemId}},
        attributes: ['id', 'name', 'is_default']
      },
      attributes: ['id', 'name']
    }).then(function(profileSystemFolders) {
      if (profileSystemFolders.length) {
        for (var i = 0, len = profileSystemFolders.length; i < len; i++) {
          if (profileSystemFolders[i].profile_systems.length) {
            for (var j = 0, len2 = profileSystemFolders[i].profile_systems.length; j < len2; j++) {
              profileSystemFolders[i].profile_systems[j].updateAttributes({
                is_default: 0
              });
            }
          }
        }
      }
    });
  }

  // function __unselectDefaultProperty(profileSystem) {
  //   profileSystem.updateAttributes({
  //     is_default: 0
  //   });
  // }

/**
 * Remove profile group
 * @param {integer}  id   This is id of profile system group
 */
function removeProfileGroup(req, res) {
  var profileSystemGroupId = req.params.id;

  models.profile_system_folders.find({
    where: {id: profileSystemGroupId}
  }).then(function(profileSystemGroup) {
    models.profile_system_folders.find({
      where: {factory_id: req.session.user.factory_id, name: 'Default'},
      attributes: ['id', 'name']
    }).then(function(deafaultGroup) {
      console.log(profileSystemGroup)
      models.profile_systems.findAll({
        where: {folder_id: profileSystemGroupId},
        attributes: ['id', 'name']
      }).then(function(profileSystems) {
        if (profileSystems.length) {
          console.log(profileSystems)
          console.log('With systems')
          for (var i = 0, len = profileSystems.length; i < len; i++) {
            __removeProfileSystemFromGroup(profileSystems[i].id, req.session.user.factory_id, deafaultGroup.id);
            if (i === len - 1) {
              setTimeout(function() {
                profileSystemGroup.destroy().then(function() {
                  res.send({status: true});
                }).catch(function(error) {
                  console.log(error);
                  res.send({status: false});
                });
              }, 800);
            }
          }
        } else {
          console.log('No systems')
          profileSystemGroup.destroy().then(function() {
            res.send({status: true});
          }).catch(function(error) {
            console.log(error);
            res.send({status: false});
          });
        }
      });
    });

  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

  function __removeProfileSystemFromGroup(id, factory_id, deafaultGroup) {
    models.profile_systems.find({
      where: {id: id}
    }).then(function(profileSystem) {
      profileSystem.updateAttributes({
        folder_id: deafaultGroup
      }).then(function() {
        // Done.
      }).catch(function(error) {
        console.log(error);
      });
    }).catch(function(error) {
      console.log(error);
    });
  }

function getDefaultProfiles(req, res) {
  models.profile_system_folders.find({
    where: {factory_id: req.session.user.factory_id, name: 'Default'},
    include: {model: models.profile_systems}
  }).then(function(profileSystemFolder) {
    res.send({status: true, profileSystems: profileSystemFolder.profile_systems})
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function addProfileFromDefault(req, res) {
  var profileGroupId = req.body.profileGroupId;
  var profileSystemId = req.body.profileSystemId;

  models.profile_systems.find({
    where: {id: profileSystemId}
  }).then(function(profileSystem) {
    profileSystem.updateAttributes({
      folder_id: parseInt(profileGroupId)
    }).then(function() {
      res.send({status: true});
    }).catch(function(error) {
      console.log(error);
      res.send({status: false});
    });
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function getProfileGroup(req, res) {
  var profileGroupId = req.params.id;

  models.profile_system_folders.find({
    where: {id: profileGroupId}
  }).then(function(profileGroup) {
    res.send({status: true, profileGroup: profileGroup});
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function saveProfileGroup(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.profile_system_folders.findOne({
      where: {id: parseInt(fields.group_id)}
    }).then(function(profileSystemGroup) {
      profileSystemGroup.updateAttributes({
        name: fields.name,
        link: fields.link,
        description: fields.description,
        position: parseInt(fields.position, 10)
      }).then(function() {
        if (files.profile_img.name) {
          var url = '/local_storage/profiles/' + Math.floor(Math.random()*1000000) + files.profile_img.name;
          loadImage(files.profile_img.path, url);

          models.profile_system_folders.findOne({
            where: {id: parseInt(fields.group_id)}
          }).then(function(profileGroup) {
            profileGroup.updateAttributes({
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

function getProfileSystemFolders(req, res) {
  models.profile_system_folders.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(profileSystemGroups) {
    res.send({
      status: true,
      profileSystemGroups: profileSystemGroups
    });
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function changeList (req, res) {
  var profileSystemId = req.body.profileSystemId;
  var field = req.body.field;
  var value = parseInt(req.body.value);

  var obj = {};
  obj[field] = value;

  models.profile_systems.find({
    where: {id: profileSystemId}
  }).then(function(profileSystem) {
    profileSystem.updateAttributes(obj).then(function() {
      res.send({status: true});
    }).catch(function(error) {
      console.log(error);
      res.send({status: false});
    });
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}

function activate (req, res) {
  var profileSystemId = req.body.profileSystemId;
  var isActivated = req.body.isActivated;

  models.profile_systems.find({
    where: {id: profileSystemId}
  }).then(function(profileSystem) {
    profileSystem.updateAttributes({
      is_editable: parseInt(isActivated)
    }).then(function() {
      res.send({status: true});
    }).catch(function(error) {
      console.log(error);
      res.send({status: false});
    });
  }).catch(function(error) {
    console.log(error);
    res.send({status: false});
  });
}
// function addNewProfileSystem(req, res) {
//   var groupId = req.body.groupId;
//   var name = req.body.name;
//   var cameras = req.body.cameras;
//   var country = req.body.country;
//   var heat_coeff = req.body.heat_coeff;
//   var noise_coeff = req.body.noise_coeff;

//   models.profile_systems.create({
//     name: name,
//     short_name: name,
//     folder_id: parseInt(groupId),
//     rama_list_id: 0,
//     rama_still_list_id: 0,
//     stvorka_list_id: 0,
//     impost_list_id: 0,
//     shtulp_list_id: 0,
//     is_editable: 0,
//     is_default: 0,
//     position: 0,
//     country: country,
//     modified: new Date(),
//     cameras: parseInt(cameras),
//     profile_system_group_id: 0,
//     heat_coeff: parseInt(heat_coeff),
//     noise_coeff: parseInt(noise_coeff)
//   }).then(function() {
//     res.send({status: true});
//   }).catch(function(error) {
//     console.log(error);
//     res.send({status: false});
//   });
// }

// function removeProfileSystem(req, res) {
//   var profileSystemId = req.body.profileSystemId;

//   models.profile_systems.find({
//     where: {id: profileSystemId}
//   }).then(function(profileSystem) {
//     profileSystem.destroy().then(function() {
//       res.send({status: true});
//     }).catch(function(error) {
//       console.log(error);
//       res.send({status: false});
//     });
//   }).catch(function(error) {
//     console.log(error);
//     res.send({status: false});
//   });
// }

function getProfileLaminations(req, res) {
  var profileId = req.params.id;

  models.profile_laminations.findAll({
    where: {
      profile_id: profileId
    }
  }).then(function(profileLaminations) {
    _getLaminationInfo(req.session.user.factory_id, function(err, result) {
      if (err) return res.send({ status: false });

      res.send({
        status               : true,
        laminations          : profileLaminations,
        frameLists           : result.frameLists,
        frameWithSillLists   : result.frameWithSillLists,
        impostLists          : result.impostLists,
        shtulpLists          : result.shtulpLists,
        leafs                : result.leafs,
        laminationColors     : result.laminationColors
      });
    });
  }).catch(function(err) {
    console.log(err);
    res.send({ status: false });
  });
}

function getLaminationDependency(req, res) {
  _getLaminationInfo(req.session.user.factory_id, function(err, result) {
    if (err) return res.send({ status: false });

    res.send({
      status               : true,
      frameLists           : result.frameLists,
      frameWithSillLists   : result.frameWithSillLists,
      impostLists          : result.impostLists,
      shtulpLists          : result.shtulpLists,
      leafs                : result.leafs,
      laminationColors     : result.laminationColors
    });
  });
}

function _getLaminationInfo(factoryId, cb) {
  models.sequelize.query("SELECT L.id, L.name " +
                           "FROM lists L " +
                           "JOIN elements E " +
                           "ON L.parent_element_id = E.id " +
                           "JOIN lists_groups LG " +
                           "ON L.list_group_id = LG.id " +
                           "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 5" +
  "").then(function(frameLists) {
    models.sequelize.query("SELECT L.id, L.name " +
                             "FROM lists L " +
                             "JOIN elements E " +
                             "ON L.parent_element_id = E.id " +
                             "JOIN lists_groups LG " +
                             "ON L.list_group_id = LG.id " +
                             "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 34" +
    "").then(function(frameWithSillLists) {
      models.sequelize.query("SELECT L.id, L.name " +
                               "FROM lists L " +
                               "JOIN elements E " +
                               "ON L.parent_element_id = E.id " +
                               "JOIN lists_groups LG " +
                               "ON L.list_group_id = LG.id " +
                               "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 3" +
      "").then(function(impostLists) {
        models.sequelize.query("SELECT L.id, L.name " +
                                 "FROM lists L " +
                                 "JOIN elements E " +
                                 "ON L.parent_element_id = E.id " +
                                 "JOIN lists_groups LG " +
                                 "ON L.list_group_id = LG.id " +
                                 "WHERE E.factory_id = " + factoryId + " AND L.list_type_id = 9" +
        "").then(function(shtulpLists) {
          models.sequelize.query("SELECT L.id, L.name " +
                                   "FROM lists L " +
                                   "JOIN elements E " +
                                   "ON L.parent_element_id = E.id " +
                                   "JOIN lists_groups LG " +
                                   "ON L.list_group_id = LG.id " +
                                   "WHERE E.factory_id = " + factoryId + " AND L.list_type_id IN (6,7)" +
          "").then(function(leafs) {
            models.lamination_factory_colors.findAll({
              where: {
                factory_id: factoryId
              }
            }).then(function(laminationColors) {
              cb(null, {
                frameLists           : frameLists,
                frameWithSillLists   : frameWithSillLists,
                impostLists          : impostLists,
                shtulpLists          : shtulpLists,
                leafs                : leafs,
                laminationColors     : laminationColors
              });
            }).catch(function(err) {
              console.log(err);
              return cb(err);
            });
          }).catch(function(err) {
            console.log(err);
            return cb(err);
          });
        }).catch(function(err) {
          console.log(err);
          return cb(err);
        });
      }).catch(function(err) {
        console.log(err);
        return cb(err);
      });
    }).catch(function(err) {
      console.log(err);
      return cb(err);
    });
  }).catch(function(err) {
    console.log(err);
    return cb(err);
  });
}

function submitLaminationDependency(req, res) {
  if (parseInt(req.body.lamination_in_id, 10) === 1 && parseInt(req.body.lamination_out_id, 10) === 1) return res.send({ status: false });

  models.profile_laminations.create({
    profile_id: parseInt(req.body.profile_id, 10),
    lamination_in_id: parseInt(req.body.lamination_in_id, 10),
    lamination_out_id: parseInt(req.body.lamination_out_id, 10),
    rama_list_id: parseInt(req.body.frame_id, 10),
    rama_still_list_id: parseInt(req.body.frame_with_sill_id, 10),
    stvorka_list_id: parseInt(req.body.leaf_id, 10),
    impost_list_id: parseInt(req.body.impost_id, 10),
    impost_in_stvorka_list_id: parseInt(req.body.impost_stvorka_id, 10),
    shtulp_list_id: parseInt(req.body.shtulp_id, 10),
    code_sync: req.body.code_sync,
    modified: new Date()
  }).then(function(newDependency) {
    res.send({ status: true, id: newDependency.id });
  }).catch(function(err) {
    console.log(err);
    res.send({ status: false });
  });
}

function editLaminationDependency(req, res) {
  models.profile_laminations.find({
    where: {
      id: req.body.dependencyId
    }
  }).then(function(laminationDependency) {
    if (req.body.field === 'lamination_in_id' && parseInt(req.body.value, 10) === 1 && laminationDependency.lamination_out_id === 1) return res.send({status: false, error: i18n.__('Current dependency is exist')});
    if (req.body.field === 'lamination_out_id' && parseInt(req.body.value, 10) === 1 && laminationDependency.lamination_in_id === 1) return res.send({status: false, error: i18n.__('Current dependency is exist')});

    var updateObj = {};
    updateObj[req.body.field] = req.body.value;

    laminationDependency.updateAttributes(updateObj)
      .then(function() {
        res.send({status: true});
      })
      .catch(function(err) {
        console.log(err);
        if (err.message === 'Validation error') return res.send({status: false, error: i18n.__('Current dependency is exist')});
        res.send({status: false, error: i18n.__('Internal server error')});
      });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false, error: i18n.__('Internal server error')});
  });
}

function getProfileCountry (req, res) {
  var groupId	= parseInt(req.params.id);
  var obj = Object.assign({},req.body);
  for (const property in obj) {
    if (obj[property] == 1)
    {
       _saveProfileSystem(groupId, property);
    }
    else
    {
       _destroyProfileSystem(groupId, property);
    }
  }  
  models.sequelize.query("SELECT CPS.country_id, CPS.profile_system_id " +
                         "FROM compliance_profile_systems CPS " +
                         "JOIN profile_systems PS " +
                         "ON CPS.profile_system_id = PS.id " +
                         "JOIN profile_system_folders PSF " +
                         "ON PS.folder_id = PSF.id " +
                         "WHERE CPS.profile_system_id = " + parseInt(groupId) +
                         " AND PSF.factory_id = " + parseInt(req.session.user.factory_id) +
  "").then(function (compliance_profile_systems) {
      var rows =  compliance_profile_systems[0];
      var whps =  {};
      for (var i = 0, len = rows.length; i < len; i++) {
    whps[rows[i].country_id]=rows[i].profile_system_id;
      };
    console.log(whps);
    res.send(whps);
  });
}

function _saveProfileSystem (profileId, countryId) {
  models.compliance_profile_systems.findOne({
    where: {
      profile_system_id: profileId,
      country_id: countryId
    }
  }).then(function (result) {
    if (result) return;
    models.compliance_profile_systems.create({
      profile_system_id: parseInt(profileId, 10),
      country_id: parseInt(countryId, 10)
    }).then(function (result) {
      return;
    });
  });
}

function _destroyProfileSystem(profileId, countryId) {
  models.compliance_profile_systems.findOne({
    where: {
      profile_system_id: profileId,
      country_id: countryId
    }
  }).then(function (result) {
    if (!result) return;
    result.destroy().then(function () {
      return;
    });
  });
}

module.exports = router;
