var express = require('express');
var router = express.Router();
var i18n = require('i18n');
var formidable = require('formidable');
var async = require('async');

var models = require('../../lib/models');
var loadImage = require('../../lib/services/imageLoader').loadImage;
var isAuthenticated = require('../../lib/services/authentication').isAdminAuth;
var util = require('util');

/** Laminations */
router.get('/laminations', isAuthenticated, getLaminations);
router.post('/lamination/save', isAuthenticated, saveLamination);
router.post('/lamination/delete', isAuthenticated, deleteLamination);

router.post('/getLaminationCountry/:id', isAuthenticated, getLaminationCountry);

/** Discounts */
router.get('/discounts', isAuthenticated, getDiscounts);
router.post('/percent/save', isAuthenticated, savePercent);
router.post('/discount/save', isAuthenticated, saveDiscount);
/** Coefficients */
router.get('/coefficients', isAuthenticated, getCoefficients);
router.post('/coef/save', isAuthenticated, saveCoef);
router.post('/coef/save_base', isAuthenticated, saveBaseCoef);
/** Glazed window */
router.get('/glazed-window', isAuthenticated, getGlazedWindow);
router.get('/glazed-window/get-folder/:id', isAuthenticated, getGlassFolder);
router.post('/glazed-window/save-folder', isAuthenticated, saveGlassFolder);
router.post('/glazed-window/add-new-folder', isAuthenticated, addNewGlassFolder);
router.post('/glazed-window/remove-folder', isAuthenticated, removeGlassFolder);

router.post('/getGlassesCountry/:id', isAuthenticated, getGlassesCountry);

/** Window sills */
router.get('/window-sills', isAuthenticated, getWindowSills);
router.post('/window-sills/add-new-folder', isAuthenticated, addNewSillFolder);
router.post('/window-sills/remove-folder', isAuthenticated, removeSillFolder);
router.get('/window-sills/get-folder/:id', isAuthenticated, getSillFolder);
router.post('/window-sills/save-folder', isAuthenticated, saveSillFolder);
/** Spillways */
router.get('/spillways', isAuthenticated, getSpillways);
router.post('/spillways/add-new-folder', isAuthenticated, addNewSpillwayFolder);
router.get('/spillways/get-folder/:id', isAuthenticated, getSpillwayFolder);
router.post('/spillways/save-folder', isAuthenticated, saveSpillwayFolder);
router.post('/spillways/remove-folder', isAuthenticated, removeSpillwayFolder);
/** Visors */
router.get('/visors', isAuthenticated, getVisors);
router.post('/visors/add-new-folder', isAuthenticated, addNewVisorFolder);
router.get('/visors/get-folder/:id', isAuthenticated, getVisorFolder);
router.post('/visors/save-folder', isAuthenticated, saveVisorFolder);
router.post('/visors/remove-folder', isAuthenticated, removeVisorFolder);
/** Suppliers */
router.get('/suppliers', isAuthenticated, getSuppliers);
router.post('/suppliers/remove', isAuthenticated, removeSupplier);
router.post('/suppliers/add-new-supplier', isAuthenticated, addNewSupplier);
router.post('/suppliers/edit-name', isAuthenticated, editSupplierName);
/** Currency */
router.get('/currency', isAuthenticated, getCurrency);
router.post('/currency/add-new-currency', isAuthenticated, addNewCurrency);
router.post('/currency/change-base-currency', isAuthenticated, changeBaseCurrency);
router.post('/currency/edit-name', isAuthenticated, editCurrencyName);
router.post('/currency/edit-value', isAuthenticated, editCurrencyValue);
router.post('/currency/remove-currency', isAuthenticated, removeCurrency);
/** General options */
router.get('/general', isAuthenticated, getGeneralOptions);
router.post('/general/change-email', isAuthenticated, changeOrderMail);
router.post('/general/add-email', isAuthenticated, addOrderMail);
router.post('/general/change-option', isAuthenticated, changeOption);
router.post('/general/identificators', isAuthenticated, updateIdentificators);
router.post('/general/folder/add', isAuthenticated, addNewOrderFolder);
router.post('/general/folder/update', isAuthenticated, updateOrderFolder);
/** Application options */
router.get('/application', isAuthenticated, getApplicationOptions);
router.post('/application/edit-link', isAuthenticated, changeAppLink);
router.post('/application/add-new-template', isAuthenticated, addNewTemplate);
router.get('/application/get-template/:id', isAuthenticated, getTemplate);
router.post('/application/edit-template', isAuthenticated, editTemplate);
router.post('/application/remove-template', isAuthenticated, removeTemplate);

/** Connectors */
router.get('/connectors', isAuthenticated, getConnectors);
/** Mosquitos */
router.get('/mosquitos', isAuthenticated, getMosquitos);
/** getDoorhandles */
router.get('/doorhandles', isAuthenticated, doorsHandles);

/** Get aviable laminations for factory */
function getLaminations (req, res) {
  models.lamination_default_colors.findAll().then(function (lamination_default) {
    models.lamination_factory_colors.findAll({
      where: {factory_id: req.session.user.factory_id},
      include: [{ model: models.lamination_default_colors}]
    }).then(function (lamination_factory) {
      models.countries.findAll({
        attributes: ["id", "name"]
      }).then(function(countries){
        models.compliance_lamination_colors.findAll({
  
        }).then(function(compliance_lamination_colors){

          const countryMap = {};
          compliance_lamination_colors.forEach(country => {
            const { lamination_factory_colors_id, country_id } = country.dataValues;
            if (!countryMap[lamination_factory_colors_id]) {
              countryMap[lamination_factory_colors_id] = [];
            }
            countryMap[lamination_factory_colors_id].push(country_id);
          });
          lamination_factory.forEach(folder => {
              folder.country_ids = countryMap[folder.id] || [];
          });

          res.render('base/options/laminations', {
            i18n               : i18n,
            title              : i18n.__('Options'),
            laminationsDefault : lamination_default,
            laminationsFactory : lamination_factory,
            countries          : countries,
            thisPageLink       : '/base/options/',
            cssSrcs            : ['/assets/stylesheets/base/options.css'],
            scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
          });
        })
      })
    });
  });
}

/** Get aviable discounts for factory */
function getDiscounts (req, res) {
  models.options_discounts.find({ where: {factory_id: req.session.user.factory_id} }).then(function (discounts) {
    res.render('base/options/discounts', {
      i18n               : i18n,
      title              : i18n.__('Options'),
      discounts          : discounts,
      thisPageLink       : '/base/options/',
      cssSrcs            : ['/assets/stylesheets/base/options.css'],
      scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
    });
  });
}

/** Get aviable coefficients for factory */
function getCoefficients(req, res) {
  models.options_coefficients.find({ where: {factory_id: req.session.user.factory_id} }).then(function (coeffs) {
    res.render('base/options/coefficients', {
      i18n               : i18n,
      title              : i18n.__('Options'),
      coeffs             : coeffs,
      thisPageLink       : '/base/options/',
      cssSrcs            : ['/assets/stylesheets/base/options.css'],
      scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
    });
  });
}

/** Get glazed window folders */
function getGlazedWindow(req, res) {
  models.glass_folders.findAll({
    where: {factory_id: req.session.user.factory_id},
    order: 'position'
  }).then(function(glassFolders) {
    models.countries.findAll({
      attributes: ["id", "name"]
    }).then(function(countries){
      models.compliance_glass_folders.findAll({

      }).then(function(compliance_glass_folders){

        const countryMap = {};
        compliance_glass_folders.forEach(country => {
          const { glass_folders_id, country_id } = country.dataValues;
          if (!countryMap[glass_folders_id]) {
            countryMap[glass_folders_id] = [];
          }
          countryMap[glass_folders_id].push(country_id);
        });
        glassFolders.forEach(folder => {
            folder.country_ids = countryMap[folder.id] || [];
        });

        // console.log('I AM GLASSFOLDERS........',glassFolders)
        res.render('base/options/glazed-window', {
          i18n               : i18n,
          title              : i18n.__('Options'),
          glassFolders       : glassFolders,
          countries          : countries,
          thisPageLink       : '/base/options/',
          cssSrcs            : ['/assets/stylesheets/base/options.css'],
          scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
        });

      });
    });  
  }).catch(function(err) {
    console.log(err);
    res.end('Internal server error.');
  });
}

function saveCoef(req, res) {
  var obj = {};
  var attribute = req.body.name;
  var value = req.body.value;
  obj[attribute] = value;

  models.options_coefficients.find({ where: {factory_id: req.session.user.factory_id} }).then(function (coeffs) {
    coeffs.updateAttributes(obj).then(function () {
      res.send(value);
    });
  });
}

function saveBaseCoef (req, res) {
  models.options_coefficients.find({ where: {factory_id: req.session.user.factory_id} }).then(function (coeffs) {
    coeffs.updateAttributes({
      margin: parseFloat(req.body.margin.replace(',', '.')),
      coeff: parseFloat(req.body.coeff.replace(',', '.'))
    }).then(function () {
      res.end();
    });
  });
}

function savePercent(req, res) {
  var position = parseInt(req.body.position);
  var value = parseFloat(req.body.value.replace(',', '.'));

  models.options_discounts.find({ where: {factory_id: req.session.user.factory_id} }).then(function (discounts) {
    var arrayValue = discounts.percents;
    arrayValue[position] = value;
    discounts.updateAttributes({
      percents: '{' + arrayValue + '}'
    }).then(function() {
      res.send(req.body.value);
    });
  });
}

function saveLamination(req, res) {
  var laminationTypeId = req.body.laminationId;
  var laminationName = req.body.laminationName;

  models.lamination_factory_colors.find({
    where: {factory_id: req.session.user.factory_id, lamination_type_id: laminationTypeId}
  }).then(function (result) {
    if (result) {
      result.updateAttributes({
        name : laminationName
      }).then(function(done) {
        res.end();
      });
    } else {
      models.lamination_factory_colors.create({
        name: laminationName,
        lamination_type_id: parseInt(laminationTypeId),
        factory_id: parseInt(req.session.user.factory_id)
      }).then(function (color) {
        res.end();
      });
      console.log('not exist!');
    }
  });
}

function deleteLamination(req, res) {
  var laminationTypeId = req.body.laminationId;
  const delId = req.body.delFromListCountry;

  if(delId) {
      models.compliance_lamination_colors.destroy({
        where: {
          lamination_factory_colors_id: delId
        }
      }).then(function (deletedCount) {

      }).catch(function (error) {
        console.error(`Error deleting records: ${error}`);
      });
  }

  models.lamination_factory_colors.find({
    where: {factory_id: req.session.user.factory_id, lamination_type_id: laminationTypeId}
  }).then(function (result) {
    if (result) {
      result.destroy().then(function() {
        console.log('deleted!');
        res.end();
      });
    } else {
      res.end();
    }
  });
}

function saveDiscount(req, res) {
  var obj = {};
  var attribute = req.body.name;
  var value = req.body.value;
  obj[attribute] = value;

  models.options_discounts.find({ where: {factory_id: req.session.user.factory_id} }).then(function (discounts) {
    discounts.updateAttributes(obj).then(function (done) {
      res.send(value);
    });
  });
}

/**
 * Get glass folder by ID
 * @param {integer} folderId
 */
function getGlassFolder(req, res) {
  var folderId = req.params.id;

  models.glass_folders.findOne({
    where: {id: folderId}
  }).then(function(folder) {
    res.send({status: true, folder: folder});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Save glass folder (edit)
 * @param {integer}  id    - folder id
 * @param {string}   name
 * @param {string}   link
 * @param {string}   description
 * @param {integer}  position
 */
function saveGlassFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.glass_folders.findOne({
      where: {id: fields.folder_id}
    }).then(function(glassFolder) {

      glassFolder.updateAttributes({
        name: fields.name,
        description: fields.description,
        link: fields.link,
        position: parseInt(fields.position)
      }).then(function () {
        if (files.folder_img.name) {
          var url = '/local_storage/glass_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
          loadImage(files.folder_img.path, url);

          models.glass_folders.findOne({
            where: {id: parseInt(fields.folder_id)}
          }).then(function(folder) {
            folder.updateAttributes({
              img: url
            });
          });
        }
        res.send({status: true});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });


  // var folderId = req.body.folder_id;
  // var name = req.body.name;
  // var link = req.body.link;
  // var position = req.body.position;
  // var description = req.body.description;
  // var img = req.body.img;

  // models.glass_folders.findOne({
  //   where: {id: folderId}
  // }).then(function(glassFolder) {
  //   glassFolder.updateAttributes({
  //     name: name,
  //     link: link,
  //     position: parseInt(position),
  //     description: description,
  //     img: img
  //   }).then(function() {
  //     res.send({status: true});
  //   }).catch(function(err) {
  //     console.log(err);
  //     res.send({status: false});
  //   });
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // });
}

/**
 * Add new glass folder
 * @param {string}  name
 * @param {string}  link
 * @param {integer} position
 * @param {string}  description
 * @param {string}  img
 */
function addNewGlassFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {

    models.glass_folders.create({
      name: fields.name,
      factory_id: parseInt(req.session.user.factory_id),
      position: fields.position || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: ''
    }).then(function(result) {
      if (files.folder_img.name) {
        var url = '/local_storage/glass_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
        loadImage(files.folder_img.path, url);

        models.glass_folders.findOne({
          where: {id: parseInt(result.id)}
        }).then(function(glassFolder) {
          glassFolder.updateAttributes({
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

  // models.glass_folders.create({
  // }).then(function() {
  //   res.send({status: true});
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // });
}

/**
 * Remove glass folder by ID
 * @param {integer}  folderId
 */
function removeGlassFolder(req, res) {
  var folderId = req.body.folderId;

  models.glass_folders.findOne({
    where: {id: folderId}
  }).then(function(glassFolder) {
    if (!glassFolder.is_base) {
      /** Find default group */
      models.glass_folders.findOne({
        where: {factory_id: req.session.user.factory_id, is_base: 1}
      }).then(function(defaultFolder) {
        var defaultFolderId = defaultFolder.id;
        /** Find all element with removed folder */
        models.elements.findAll({
          where: {glass_folder_id: folderId}
        }).then(function(elements) {
          if (elements.length) {
            for (var i = 0, len = elements.length; i < len; i++) {
              __setDefaultFolderForElements(elements[i], defaultFolderId);
            }
            setTimeout(function() {
              glassFolder.destroy().then(function() {
                res.send({status: true});
              });
            }, 1500);
          } else {
            glassFolder.destroy().then(function() {
              res.send({status: true});
            });
          }
        });
      });
    } else {
      res.send({status: false});
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}
  /** Set default folder for elements which were in destroyed folder */
  function __setDefaultFolderForElements(element, defaultFolderId) {
    element.updateAttributes({
      glass_folder_id: parseInt(defaultFolderId)
    });
  }

/** Get window sills */
// подоконники
// function getWindowSills(req, res) {
//   models.addition_folders.findAll({
//     where: {factory_id: req.session.user.factory_id, addition_type_id: 8}
//   }).then(function(sillsFolders) {
//     res.render('base/options/window-sills', {
//       i18n               : i18n,
//       title              : i18n.__('Options'),
//       sillsFolders       : sillsFolders,
//       thisPageLink       : '/base/options/',
//       cssSrcs            : ['/assets/stylesheets/base/options.css'],
//       scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
//     });
//   }).catch(function(err) {
//     console.log(err);
//     res.send('Internal server error.')
//   });
// }
function getWindowSills (req, res) {
  var folderTypeId = 8;
  var colorTypeId = 32;
  Promise.all([getColor(colorTypeId), getAdditionFolder(folderTypeId, req.session.user.factory_id)]).then((results) => {
    const [sillsColorsFolders, sillsFolders] = results;
    if (sillsColorsFolders === null || sillsFolders === null || sillsColorsFolders === undefined || sillsFolders === undefined) {
      res.send('Internal server error.');
    } else {
        res.render('base/options/window-sills', {
          i18n                : i18n,
          title               : i18n.__('Options'),
          sillsFolders        : sillsFolders,
          sillsColorsFolders  : sillsColorsFolders,
          folderTypeId        : folderTypeId,
          colorTypeId         : colorTypeId,
          thisPageLink        : '/base/options/',
          cssSrcs             : ['/assets/stylesheets/base/options.css'],
          scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
        });
    }
  });  
}

/**
 * Add new sill folder
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function addNewSillFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {

    models.addition_folders.create({
      name: fields.name,
      addition_type_id: 8,
      factory_id: parseInt(req.session.user.factory_id),
      position: fields.position || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: '',
      max_size: parseInt(fields.max_size, 10) || 0
    }).then(function(result) {
      if (files.folder_img.name) {
        var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
        loadImage(files.folder_img.path, url);

        models.addition_folders.findOne({
          where: {id: parseInt(result.id)}
        }).then(function(windowSillFolder) {
          windowSillFolder.updateAttributes({
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

  // models.addition_folders.create({
  //   name: req.body.name,
  //   addition_type_id: 8,
  //   factory_id: parseInt(req.session.user.factory_id),
  //   modified: new Date(),
  //   link: req.body.link,
  //   description: req.body.description,
  //   img: req.body.img,
  //   position: parseInt(req.body.position) || 0
  // }).then(function() {
  //   res.send({status: true});
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // });
}

/**
 * Remove sill folderby ID
 */
function removeSillFolder(req, res) {
  var folderId = req.body.folderId;

  models.addition_folders.findOne({
    where: {id: folderId, factory_id: req.session.user.factory_id}
  }).then(function(sillFolder) {
    models.lists.findAll({
      where: {addition_folder_id: folderId},
      //include: {model: models.elements, where: {factory_id: req.session.user.factory_id}}
    }).then(function(sillLists) {
      console.log(sillLists)
      if (sillLists.length) {
        for (var i = 0, len = sillLists.length; i < len; i++) {
          _setListToDefaultFolder(sillLists[i]);
        }
        setTimeout(function() {
          sillFolder.destroy().then(function() {
           res.send({status: true});
          }).catch(function(err) {
           console.log(err);
           res.send({status: false});
          });
        }, 800);
      } else {
        sillFolder.destroy().then(function() {
         res.send({status: true});
        }).catch(function(err) {
         console.log(err);
         res.send({status: false});
        });
      }
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

  function _setListToDefaultFolder(list) {
    list.updateAttributes({
      addition_folder_id: 0
    });
  }

/**
 * Get sill folder by ID
 */
function getSillFolder(req, res) {
  var folderId = req.params.id;

  models.addition_folders.findOne({
    where: {id: folderId}
  }).then(function(sillFolder) {
    res.send({status: true, folder: sillFolder});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Save sill folder (Edit)
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function saveSillFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.addition_folders.findOne({
      where: {id: fields.folder_id}
    }).then(function(sillFolder) {

      sillFolder.updateAttributes({
        name: fields.name,
        description: fields.description,
        link: fields.link,
        position: parseInt(fields.position),
        max_size: parseInt(fields.max_size, 10) || 0
      }).then(function () {
        if (files.folder_img.name) {
          var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
          loadImage(files.folder_img.path, url);

          models.addition_folders.findOne({
            where: {id: parseInt(fields.folder_id)}
          }).then(function(folder) {
            folder.updateAttributes({
              img: url
            });
          });
        }
        res.send({status: true});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });

  // var folderId = req.params.id;

  // models.addition_folders.findOne({
  //   where: {id: folderId}
  // }).then(function(sillFolder) {
  //   sillFolder.updateAttributes({
  //     name: req.body.name,
  //     link: req.body.link,
  //     description: req.body.description,
  //     img: req.body.img,
  //     position: parseInt(req.body.position)
  //   }).then(function() {
  //     res.send({status: true});
  //   }).catch(function(err) {
  //     console.log(err);
  //     res.send({status: false});
  //   });
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // })
}

/**
 * Get spillways folders
 */
// отливы
// function getSpillways(req, res) {
//   models.addition_folders.findAll({
//     where: {factory_id: req.session.user.factory_id, addition_type_id: 9}
//   }).then(function(spillwaysFolders) {
//     res.render('base/options/spillways', {
//       i18n               : i18n,
//       title              : i18n.__('Options'),
//       spillwaysFolders   : spillwaysFolders,
//       thisPageLink       : '/base/options/',
//       cssSrcs            : ['/assets/stylesheets/base/options/spillways.css'],
//       scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/spillways.js']
//     });
//   }).catch(function(err) {
//     console.log(err);
//     res.send('Internal server error.')
//   });
// }
function getSpillways(req, res) {
  var folderTypeId = 9;
  var colorTypeId = 33;
  Promise.all([getColor(colorTypeId), getAdditionFolder(folderTypeId, req.session.user.factory_id)]).then((results) => {
    const [spillwaysColorsFolders, spillwaysFolders] = results;
    if (spillwaysColorsFolders === null || spillwaysFolders === null || spillwaysColorsFolders === undefined || spillwaysFolders === undefined) {
      res.send('Internal server error.');
    } else {
        res.render('base/options/spillways', {
          i18n                    : i18n,
          title                   : i18n.__('Options'),
          spillwaysFolders        : spillwaysFolders,
          spillwaysColorsFolders  : spillwaysColorsFolders,
          folderTypeId            : folderTypeId,
          colorTypeId             : colorTypeId,
          thisPageLink            : '/base/options/',
          cssSrcs                 : ['/assets/stylesheets/base/options/spillways.css'],
          scriptSrcs              : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/spillways.js']
        });
    }
  });  
}

/**
 * Add new spillway folder
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function addNewSpillwayFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.addition_folders.create({
      name: fields.name,
      addition_type_id: 9,
      factory_id: parseInt(req.session.user.factory_id),
      position: fields.position || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: '',
      max_size: parseInt(fields.max_size, 10) || 0
    }).then(function(result) {
      if (files.folder_img.name) {
        var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
        loadImage(files.folder_img.path, url);

        models.addition_folders.findOne({
          where: {id: parseInt(result.id)}
        }).then(function(spillwayFolder) {
          spillwayFolder.updateAttributes({
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

  // models.addition_folders.create({
  //   name: req.body.name,
  //   addition_type_id: 9,
  //   factory_id: parseInt(req.session.user.factory_id),
  //   modified: new Date(),
  //   link: req.body.link,
  //   description: req.body.description,
  //   img: req.body.img,
  //   position: parseInt(req.body.position) || 0
  // }).then(function() {
  //   res.send({status: true});
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // });
}

/**
 * Get spillway folder by ID
 */
function getSpillwayFolder(req, res) {
  var folderId = req.params.id;

  models.addition_folders.findOne({
    where: {id: folderId}
  }).then(function(spillwayFolder) {
    res.send({status: true, folder: spillwayFolder});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Save spillway folder (Edit)
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function saveSpillwayFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.addition_folders.findOne({
      where: {id: fields.folder_id}
    }).then(function(spillwayFolder) {
      spillwayFolder.updateAttributes({
        name: fields.name,
        description: fields.description,
        link: fields.link,
        position: parseInt(fields.position),
        max_size: parseInt(fields.max_size, 10) || 0
      }).then(function () {
        if (files.folder_img.name) {
          var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
          loadImage(files.folder_img.path, url);

          models.addition_folders.findOne({
            where: {id: parseInt(fields.folder_id)}
          }).then(function(folder) {
            folder.updateAttributes({
              img: url
            });
          });
        }
        res.send({status: true});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });

  // var folderId = req.params.id;

  // models.addition_folders.findOne({
  //   where: {id: folderId}
  // }).then(function(spillwayFolder) {
  //   spillwayFolder.updateAttributes({
  //     name: req.body.name,
  //     link: req.body.link,
  //     description: req.body.description,
  //     img: req.body.img,
  //     position: parseInt(req.body.position)
  //   }).then(function() {
  //     res.send({status: true});
  //   }).catch(function(err) {
  //     console.log(err);
  //     res.send({status: false});
  //   });
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // })
}

/**
 * Remove spillway folder
 * @param {integer} folderId
 */
function removeSpillwayFolder(req, res) {
  var folderId = req.body.folderId;

  models.addition_folders.findOne({
    where: {id: folderId, factory_id: req.session.user.factory_id}
  }).then(function(spillwayFolder) {
    models.lists.findAll({
      where: {addition_folder_id: folderId},
      //include: {model: models.elements, where: {factory_id: req.session.user.factory_id}}
    }).then(function(spillwayLists) {
      if (spillwayLists.length) {
        for (var i = 0, len = spillwayLists.length; i < len; i++) {
          _setListToDefaultFolder(spillwayLists[i]);
        }
        setTimeout(function() {
          spillwayFolder.destroy().then(function() {
           res.send({status: true});
          }).catch(function(err) {
           console.log(err);
           res.send({status: false});
          });
        }, 800);
      } else {
        spillwayFolder.destroy().then(function() {
         res.send({status: true});
        }).catch(function(err) {
         console.log(err);
         res.send({status: false});
        });
      }
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Get visors folders
 */
function getVisors(req, res) {
  models.addition_folders.findAll({
    where: {factory_id: req.session.user.factory_id, addition_type_id: 21}
  }).then(function(visorsFolders) {
    res.render('base/options/visors', {
      i18n               : i18n,
      title              : i18n.__('Options'),
      visorsFolders      : visorsFolders,
      thisPageLink       : '/base/options/',
      cssSrcs            : ['/assets/stylesheets/base/options/visors.css'],
      scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/visors.js']
    });
  }).catch(function(err) {
    console.log(err);
    res.send('Internal server error.')
  });
}
/**
 * Add new visor folder
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function addNewVisorFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.addition_folders.create({
      name: fields.name,
      addition_type_id: 21,
      factory_id: parseInt(req.session.user.factory_id),
      position: fields.position || 0,
      modified: new Date(),
      link: fields.link,
      description: fields.description,
      img: '',
      max_size: parseInt(fields.max_size, 10) || 0
    }).then(function(result) {
      if (files.folder_img.name) {
        var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
        loadImage(files.folder_img.path, url);

        models.addition_folders.findOne({
          where: {id: parseInt(result.id)}
        }).then(function(visorFolder) {
          visorFolder.updateAttributes({
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

  // models.addition_folders.create({
  //   name: req.body.name,
  //   addition_type_id: 21,
  //   factory_id: parseInt(req.session.user.factory_id),
  //   modified: new Date(),
  //   link: req.body.link,
  //   description: req.body.description,
  //   img: req.body.img,
  //   position: parseInt(req.body.position) || 0
  // }).then(function() {
  //   res.send({status: true});
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // });
}

/**
 * Get visor folder by ID
 */
function getVisorFolder(req, res) {
  var folderId = req.params.id;

  models.addition_folders.findOne({
    where: {id: folderId}
  }).then(function(visorFolder) {
    res.send({status: true, folder: visorFolder});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Save visor folder (Edit)
 * @param {string}  name
 * @param {string}  link
 * @param {string}  description
 * @param {string}  img
 * @param {integer} position
 */
function saveVisorFolder(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.addition_folders.findOne({
      where: {id: fields.folder_id}
    }).then(function(visorFolder) {

      visorFolder.updateAttributes({
        name: fields.name,
        description: fields.description,
        link: fields.link,
        position: parseInt(fields.position),
        max_size: parseInt(fields.max_size, 10) || 0
      }).then(function () {
        if (files.folder_img.name) {
          var url = '/local_storage/addition_folders/' + Math.floor(Math.random()*1000000) + files.folder_img.name;
          loadImage(files.folder_img.path, url);

          models.addition_folders.findOne({
            where: {id: parseInt(fields.folder_id)}
          }).then(function(folder) {
            folder.updateAttributes({
              img: url
            });
          });
        }
        res.send({status: true});
      });
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });

  // var folderId = req.params.id;

  // models.addition_folders.findOne({
  //   where: {id: folderId}
  // }).then(function(visorFolder) {
  //   visorFolder.updateAttributes({
  //     name: req.body.name,
  //     link: req.body.link,
  //     description: req.body.description,
  //     img: req.body.img,
  //     position: parseInt(req.body.position)
  //   }).then(function() {
  //     res.send({status: true});
  //   }).catch(function(err) {
  //     console.log(err);
  //     res.send({status: false});
  //   });
  // }).catch(function(err) {
  //   console.log(err);
  //   res.send({status: false});
  // })
}

/**
 * Remove visor folder
 * @param {integer} folderId
 */
function removeVisorFolder(req, res) {
  var folderId = req.body.folderId;

  models.addition_folders.findOne({
    where: {id: folderId, factory_id: req.session.user.factory_id}
  }).then(function(visorFolder) {
    models.lists.findAll({
      where: {addition_folder_id: folderId},
      //include: {model: models.elements, where: {factory_id: req.session.user.factory_id}}
    }).then(function(visorLists) {
      if (visorLists.length) {
        for (var i = 0, len = visorLists.length; i < len; i++) {
          _setListToDefaultFolder(visorLists[i]);
        }
        setTimeout(function() {
          visorFolder.destroy().then(function() {
           res.send({status: true});
          }).catch(function(err) {
           console.log(err);
           res.send({status: false});
          });
        }, 800);
      } else {
        visorFolder.destroy().then(function() {
         res.send({status: true});
        }).catch(function(err) {
         console.log(err);
         res.send({status: false});
        });
      }
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/** Get suppliers */
function getSuppliers(req, res) {
  models.suppliers.findAll({
    where: {factory_id: req.session.user.factory_id}
  }).then(function(suppliers) {
    res.render('base/options/suppliers', {
      i18n: i18n,
      title: i18n.__('Suppliers'),
      suppliers: suppliers,
      cssSrcs: ['/assets/stylesheets/base/options/suppliers.css'],
      scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/suppliers.js']
    });
  }).catch(function(err) {
    console.log(err);
    res.send('Internal server error.');
  });
}

/**
 * Remove supplier
 * @param {integer}  supplierId
 */
function removeSupplier(req, res) {
  var supplierId = req.body.supplierId;

  models.suppliers.findOne({
    where: {id: supplierId, factory_id: req.session.user.factory_id}
  }).then(function(supplier) {
    models.elements.findAll({
      where: {supplier_id: supplierId}
    }).then(function(elements) {
      if (elements.length) {
        for (var i = 0, len = elements.length; i < len; i++) {
          /** set element supplier to default */
          __setElementSuplierToDefault(elements[i]);
          if (i == len - 1) {
            supplier.destroy().then(function() {
              res.send({status: true});
            }).catch(function(err) {
              console.log(err);
              res.send({status: false});
            });
          }
        }
      } else {
        supplier.destroy().then(function() {
          res.send({status: true});
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
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
}
  /** Set element supplierto default */
  function __setElementSuplierToDefault(element) {
    element.updateAttributes({
      supplier_id: 0
    });
  }

/** Add new supplier */
function addNewSupplier(req, res) {
  var name = req.body.name;

  models.suppliers.create({
    name: name,
    factory_id: parseInt(req.session.user.factory_id),
    modified: new Date()
  }).then(function() {
    res.redirect('/base/options/suppliers');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/base/options/suppliers');
  });
}

/**
 * Edit supplier name
 * @param {integer}  supplierId
 * @param {integer}  name
 */
function editSupplierName(req, res) {
  var supplierId = req.body.supplierId;
  var name = req.body.value;

  models.suppliers.findOne({
    where: {id: supplierId, factory_id: req.session.user.factory_id}
  }).then(function(supplier) {
    supplier.updateAttributes({
      name: name
    }).then(function() {
      res.send(name);
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Get currency
 */
function getCurrency(req, res) {
  models.currencies.findAll({
    where: {factory_id: req.session.user.factory_id},
    order: ['id']
  }).then(function(currencies) {
    res.render('base/options/currency', {
      i18n: i18n,
      title: i18n.__('Currency'),
      currencies: currencies,
      cssSrcs: ['/assets/stylesheets/base/options/currency.css'],
      scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/currency.js']
    });
  }).catch(function(err) {
    console.log(err);
    res.send('Internal server error.');
  });
}

/**
 * Add new currency
 * @param {string}  name
 */
function addNewCurrency(req, res) {
  var name = req.body.name;
  var value = req.body.value;

  models.currencies.create({
    name: name,
    value: parseFloat(value),
    factory_id: parseInt(req.session.user.factory_id, 10),
    is_base: 0,
    modified: new Date()
  }).then(function() {
    res.redirect('/base/options/currency');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/base/options/currency');
  });
}

/**
 * Change base currency
 * @param {integer} currencyId
 */
function changeBaseCurrency(req, res) {
  var currencyId = req.body.currencyId;

  /** Find old base currency */
  models.currencies.find({
    where: {factory_id: req.session.user.factory_id, is_base: 1}
  }).then(function(baseCurrency) {
    /** Remove this currency as base */
    baseCurrency.updateAttributes({
      is_base: 0
    }).then(function() {
      /** Find requested currency */
      models.currencies.find({
        where: {id: currencyId}
      }).then(function(newBaseCurrency) {
        /** Set requested currency as base */
        newBaseCurrency.updateAttributes({
          is_base: 1
        }).then(function() {
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
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Edit currency name
 * @param {string}  value
 * @param {integer} currencyId
 */
function editCurrencyName(req, res) {
  var name = req.body.value;
  var currencyId = req.body.currencyId;

  models.currencies.find({
    where: {id: currencyId}
  }).then(function(currentCurrency) {
    currentCurrency.updateAttributes({
      name: name
    }).then(function() {
      res.send(name);
    }).catch(function(err) {
      console.log(err);
      res.send(i18n.__('Error'));
    });
  }).catch(function() {
    console.log(err);
    res.send(i18n.__('Error'));
  });
}

/**
 * Edit currency value
 * @param {float}   value
 * @param {integer} currencyId
 */
function editCurrencyValue(req, res) {
  var value = req.body.value;
  var currencyId = req.body.currencyId;

  models.currencies.find({
    where: {id: currencyId}
  }).then(function(currentCurrency) {
    currentCurrency.updateAttributes({
      value: parseFloat(value)
    }).then(function() {
      res.send(parseFloat(value).toFixed(2));
    }).catch(function(err) {
      console.log(err);
      res.send(i18n.__('Error'));
    });
  }).catch(function(err) {
    console.log(err);
    res.send(i18n.__('Error'));
  });
}

/**
 * Remove currency by Id
 * @param {integer}  currencyId
 */
function removeCurrency(req, res) {
  var currencyId = req.body.currencyId;

  models.currencies.find({
    where: {id: currencyId}
  }).then(function(currentCurrency) {
    if (!currentCurrency.is_base) {
      /** Find base currency */
      models.currencies.find({
        where: {factory_id: req.session.user.factory_id, is_base: 1},
        attributes: ['id']
      }).then(function(baseCurrency) {
        var baseCurrencyId = baseCurrency.id;
        /** Find all elements with currenct currency */
        models.elements.findAll({
          where: {currency_id: currencyId}
        }).then(function(elements) {
          /** Async update currency_id for each element to base currency */
          async.each(elements, function(element, __callback) {
            element.updateAttributes({
              currency_id: parseInt(baseCurrencyId)
            }).then(function() {
              __callback();
            }).catch(function(err) {
              console.log(err);
              __callback();
            });
          }, function(err) {
            if (err) {
              console.log(err);
            }
            /** Destroy currency */
            currentCurrency.destroy().then(function() {
              res.send({status: true});
            });
          });
        }).catch(function(err) {
          console.log(err);
          res.send({status: false});
        });
      });
    } else {
      /** If currenct currency is base - return false */
      res.send({status: false});
    }
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/** Get general options */
function getGeneralOptions(req, res) {
  models.factories.findOne({
    where: {id: req.session.user.factory_id},
    include: [{model: models.factory_emails}],
    order: [[models.factory_emails, 'id', 'DESC']]
  }).then(function(factory) {
    models.user_identificators.find({
      where: {
        factory_id: req.session.user.factory_id
      }
    }).then(function (factoryIdentificators) {
      models.order_folders.findAll({
        where: {
          factory_id: req.session.user.factory_id
        },
        order: ['id']
      }).then(function (factoryOrderFolders) {
        res.render('base/options/general', {
          i18n: i18n,
          title: i18n.__('General options'),
          factory: factory,
          factoryIdentificators: factoryIdentificators,
          factoryOrderFolders: factoryOrderFolders,
          cssSrcs: ['/assets/stylesheets/base/options/general.css'],
          scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/general.js']
        });
      }).catch(function (error) {
        console.log(error);
        res.send('Internal server error.');
      })
    }).catch(function (error) {
      console.log(err);
      res.send('Internal server error.');
    });
  }).catch(function(err) {
    console.log(err);
    res.send('Internal server error.');
  });
}

/**
 * Change order mail for factory
 * @param {integer} rowId
 * @param {string}  email
 */
function changeOrderMail(req, res) {
  models.factory_emails.find({
    where: {id: req.body.rowId}
  }).then(function(factory) {
    factory.updateAttributes({
      email: req.body.email
    }).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false, error: 'Error on updating factory email.'})
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false, error: 'Error on getting factory email.'})
  });
}

function addOrderMail(req, res) {
  models.factory_emails.create({
    factory_id: parseInt(req.session.user.factory_id, 10),
    email: ''
  }).then(function(result) {
    res.send({status: true, id: result.id, email: result.email});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function changeOption (req, res) {
  models.factories.find({
    where: { id: req.session.user.factory_id }
  }).then(function(factory) {
    var changeObj = {};
    changeObj[req.body.type] = parseInt(req.body.value, 10);
    factory.updateAttributes(changeObj).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    })
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function updateIdentificators (req, res) {
  models.user_identificators.find({
    where: {
      factory_id: req.session.user.factory_id
    }
  }).then(function (factoryIdentificators) {
    factoryIdentificators.updateAttributes({
      identificator_1: req.body.identificator_1,
      identificator_2: req.body.identificator_2,
      identificator_3: req.body.identificator_3,
      identificator_4: req.body.identificator_4,
      identificator_5: req.body.identificator_5,
      identificator_6: req.body.identificator_6,
      identificator_7: req.body.identificator_7,
      identificator_8: req.body.identificator_8,
      identificator_9: req.body.identificator_9,
      identificator_10: req.body.identificator_10,
      identificator_11: req.body.identificator_11,
      identificator_12: req.body.identificator_12,
      identificator_13: req.body.identificator_13,
      identificator_14: req.body.identificator_14
    }).then(function () {
      res.redirect('/base/options/general');
    }).catch(function (error) {
      console.log(error);
      res.send('Internal server error.');
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
}

function addNewOrderFolder (req, res) {
  var name = req.body.name;

  models.order_folders.create({
    factory_id: req.session.user.factory_id,
    name: name,
    modified: new Date()
  }).then(function (newFolder) {
    res.send({ status: true, rowId: newFolder.id });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
}

function updateOrderFolder (req, res) {
  var name = req.body.name;
  var rowId = req.body.rowId;

  models.order_folders.find({
    where: {
      id: rowId
    }
  }).then(function (orderFolder) {
    orderFolder.updateAttributes({
      name: name,
      modified: new Date()
    }).then(function () {
      res.send({ status: true });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    })
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
}

/**
 * Get application options
 */
function getApplicationOptions(req, res) {
  models.background_templates.findAll({
    where: { factory_id: req.session.user.factory_id },
    include: [{ model: models.template_groups }],
    order: 'position'
  }).then(function(backgroundTemplates) {
    models.factories.find({
      where: {id: req.session.user.factory_id},
      attributes: ['link']
    }).then(function(factory) {
      res.render('base/options/app', {
        i18n: i18n,
        title: i18n.__('Application options'),
        backgroundTemplates: backgroundTemplates,
        appLink: factory.link,
        cssSrcs: ['/assets/stylesheets/base/options/app.css'],
        scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/app.js']
      });
    }).catch(function(err) {
      console.log(err);
      res.send('Internal server error');
    });
  }).catch(function(err) {
    console.log(err);
    res.send('Internal server error');
  });
}

/**
 * Change link in application
 * @param {string} link
 */
function changeAppLink(req, res) {
  models.factories.find({
    where: {id: req.session.user.factory_id}
  }).then(function(factory) {
    factory.updateAttributes({
      link: req.body.link
    }).then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

/**
 * Add new template
 * @param
 */
function addNewTemplate(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (!files.template_img.name) return res.send({status: false});

    var url = '/local_storage/templates/' + Math.floor(Math.random()*1000000) + files.template_img.name;

    models.background_templates.create({
      position: parseInt(fields.position, 10),
      group_id: parseInt(fields.type, 10),
      template_id: parseInt(fields.template, 10),
      desc_1: fields.desc_1,
      desc_2: fields.desc_2,
      factory_id: parseInt(req.session.user.factory_id, 10),
      img: url,
      modified: new Date()
    }).then(function(result) {
      loadImage(files.template_img.path, url);
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  });
}

/** Get template by id */
function getTemplate(req, res) {
  models.background_templates.find({
    where: {id: req.params.id}
  }).then(function(template) {
    res.send({status: true, template: template});
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function editTemplate(req, res) {
  var form = new formidable.IncomingForm();

  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    models.background_templates.find({
      where: {id: fields.template_id}
    }).then(function(template) {
      template.updateAttributes({
        position: parseInt(fields.position, 10),
        group_id: parseInt(fields.type, 10),
        template_id: parseInt(fields.template, 10),
        desc_1: fields.desc_1,
        desc_2: fields.desc_2,
        modified: new Date()
      }).then(function(result) {
        if (!files.template_img.name) return res.send({status: true});

        var url = '/local_storage/templates/' + Math.floor(Math.random()*1000000) + files.template_img.name;
        loadImage(files.template_img.path, url);

        models.background_templates.find({
          where: {id: fields.template_id}
        }).then(function(template) {
          template.updateAttributes({
            img: url,
            modified: new Date()
          }).then(function() {
            res.send({status: true});
          });
        });

      }).catch(function(err) {
        console.log(err);
        res.send({status: false});
      });
    });
  });
}

/** Remove tempalte by id */
function removeTemplate(req, res) {
  models.background_templates.find({
    where: {id: req.body.id}
  }).then(function(template) {
    template.destroy().then(function() {
      res.send({status: true});
    }).catch(function(err) {
      console.log(err);
      res.send({status: false});
    });
  }).catch(function(err) {
    console.log(err);
    res.send({status: false});
  });
}

function getConnectors (req, res) {
  var folderTypeId = 7;

  models.addition_folders.findAll({
    where: {
      factory_id: req.session.user.factory_id,
      addition_type_id: folderTypeId
    }
  }).then(function (connectorsFolders) {
    res.render('base/options/connectors', {
      i18n: i18n,
      title: i18n.__('Connectors'),
      connectorsFolders: connectorsFolders,
      folderTypeId: folderTypeId,
      cssSrcs: ['/assets/stylesheets/base/options/templates.css'],
      scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                   '/assets/javascripts/base/options/index.js',
                   '/assets/javascripts/base/options/connectors.js']
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
}

function getMosquitos (req, res) {
  var folderTypeId = 12;

  models.addition_folders.findAll({
    where: {
      factory_id: req.session.user.factory_id,
      addition_type_id: folderTypeId
    }
  }).then(function (mosquitosFolders) {
    res.render('base/options/mosquitos', {
      i18n: i18n,
      title: i18n.__('Connectors'),
      mosquitosFolders: mosquitosFolders,
      folderTypeId: folderTypeId,
      cssSrcs: ['/assets/stylesheets/base/options/templates.css'],
      scriptSrcs: ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                   '/assets/javascripts/base/options/index.js',
                   '/assets/javascripts/base/options/mosquitos.js']
    });
  }).catch(function (error) {
    console.log(error);
    res.send('Internal server error.');
  });
}
// ручки
function doorsHandles (req, res) {
  var folderTypeId = 10;
  var colorTypeId = 24;
  Promise.all([getColor(colorTypeId), getAdditionFolder(folderTypeId, req.session.user.factory_id)]).then((results) => {
    const [handleColorsFolders, doorhandlesFolders] = results;
    if (handleColorsFolders === null || doorhandlesFolders === null || handleColorsFolders === undefined || doorhandlesFolders === undefined) {
      res.send('Internal server error.');
    } else {
        res.render('base/options/doorhandles', {
          i18n                : i18n,
          title               : i18n.__('Connectors'),
          doorhandlesFolders  : doorhandlesFolders,
          handleColorsFolders : handleColorsFolders,
          folderTypeId        : folderTypeId,
          colorTypeId         : colorTypeId,
          cssSrcs             : ['/assets/stylesheets/base/options/templates.css'],
          scriptSrcs          : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js',
                                '/assets/javascripts/base/options/index.js',
                                '/assets/javascripts/base/options/doorhandles.js']
        });
    }
  });  
}

// function getWindowSills(req, res) {
//   models.addition_folders.findAll({
//     where: {factory_id: req.session.user.factory_id, addition_type_id: 8}
//   }).then(function(sillsFolders) {
//     res.render('base/options/window-sills', {
//       i18n               : i18n,
//       title              : i18n.__('Options'),
//       sillsFolders       : sillsFolders,
//       thisPageLink       : '/base/options/',
//       cssSrcs            : ['/assets/stylesheets/base/options.css'],
//       scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options.js']
//     });
//   }).catch(function(err) {
//     console.log(err);
//     res.send('Internal server error.')
//   });
// }
// function getSpillways(req, res) {
//   models.addition_folders.findAll({
//     where: {factory_id: req.session.user.factory_id, addition_type_id: 9}
//   }).then(function(spillwaysFolders) {
//     res.render('base/options/spillways', {
//       i18n               : i18n,
//       title              : i18n.__('Options'),
//       spillwaysFolders   : spillwaysFolders,
//       thisPageLink       : '/base/options/',
//       cssSrcs            : ['/assets/stylesheets/base/options/spillways.css'],
//       scriptSrcs         : ['/assets/javascripts/vendor/localizer/i18next-1.10.1.min.js', '/assets/javascripts/base/options/spillways.js']
//     });
//   }).catch(function(err) {
//     console.log(err);
//     res.send('Internal server error.')
//   });
// }

function getColor (colorId) {
  return models.addition_colors.findAll({
    where: {
      lists_type_id: colorId
    }
  }).then(function (handleColorsFolders) {
    return handleColorsFolders;
  }).catch(function (error) {
    console.error(error);
    return null;
  });
}

function getAdditionFolder (additionalTypeId, factoryId) {
  return models.addition_folders.findAll({
    where: {
      factory_id: factoryId,
      addition_type_id: additionalTypeId
    }
  }).then(function (doorhandlesFolders) {
      return doorhandlesFolders;
  }).catch(function (error) {
    console.error(error);
    return null;
  });
}

// checkboxes country
  // glassesCountry

function getGlassesCountry (req, res) {
  var groupId	= parseInt(req.params.id);
  var obj = Object.assign({},req.body);
  for (const property in obj) {
    if (obj[property] == 1)
    {
       _saveGlassesSystem(groupId, property);
    }
    else
    {
       _destroyGlassesSystem(groupId, property);
    }
  }  
    models.sequelize.query("SELECT CGF.country_id, CGF.glass_folders_id " +
                          "FROM compliance_glass_folders CGF " +
                          "JOIN glass_folders GF " +
                          "ON CGF.glass_folders_id = GF.id " +
                          // "JOIN window_hardware_folders GF " +
                          // "ON GF.folder_id = GF.id " +
                          "WHERE CGF.glass_folders_id = " + parseInt(groupId) +
                          " AND GF.factory_id = " + parseInt(req.session.user.factory_id) +
    "").then(function (compliance_glass_folders) {
        var rows =  compliance_glass_folders[0];
        var whps =  {};
        for (var i = 0, len = rows.length; i < len; i++) {
      whps[rows[i].country_id]=rows[i].glass_folders_id;
        };
      console.log(whps);
      res.send(whps);
    });
}

function _saveGlassesSystem (glassesId, countryId) {
  models.compliance_glass_folders.findOne({
    where: {
      glass_folders_id: glassesId,
      country_id: countryId
    }
  }).then(function (result) {
    if (result) return;
    models.compliance_glass_folders.create({
      glass_folders_id: parseInt(glassesId, 10),
      country_id: parseInt(countryId, 10)
    }).then(function (result) {
      return;
    });
  });
}

function _destroyGlassesSystem(glassesId, countryId) {
  models.compliance_glass_folders.findOne({
    where: {
      glass_folders_id: glassesId,
      country_id: countryId
    }
  }).then(function (result) {
    if (!result) return;
    result.destroy().then(function () {
      return;
    });
  });
}

  // laminationCountry
function getLaminationCountry (req, res) {
  var groupId	= parseInt(req.params.id);
  var obj = Object.assign({},req.body);
  for (const property in obj) {
    if (obj[property] == 1)
    {
       _saveLaminationSystem(groupId, property);
    }
    else
    {
       _destroyLaminationSystem(groupId, property);
    }
  }  
  models.sequelize.query("SELECT CLC.country_id, CLC.lamination_factory_colors_id " +
                         "FROM compliance_lamination_colors CLC " +
                         "JOIN lamination_factory_colors LFC " +
                         "ON CLC.lamination_factory_colors_id = LFC.id " +
                        //  "JOIN window_hardware_folders WHF " +
                        //  "ON LFC.folder_id = WHF.id " +
                         "WHERE CLC.lamination_factory_colors_id = " + parseInt(groupId) +
                         " AND LFC.factory_id = " + parseInt(req.session.user.factory_id) +
  "").then(function (compliance_lamination_colors) {
      var rows =  compliance_lamination_colors[0];
      var whps =  {};
      for (var i = 0, len = rows.length; i < len; i++) {
    whps[rows[i].country_id]=rows[i].lamination_factory_colors_id;
      };
    console.log(whps);
    res.send(whps);
  });
}

function _saveLaminationSystem (laminationId, countryId) {
  models.compliance_lamination_colors.findOne({
    where: {
      lamination_factory_colors_id: laminationId,
      country_id: countryId
    }
  }).then(function (result) {
    if (result) return;
    models.compliance_lamination_colors.create({
      lamination_factory_colors_id: parseInt(laminationId, 10),
      country_id: parseInt(countryId, 10)
    }).then(function (result) {
      return;
    });
  });
}

function _destroyLaminationSystem(laminationId, countryId) {
  models.compliance_lamination_colors.findOne({
    where: {
      lamination_factory_colors_id: laminationId,
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
