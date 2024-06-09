var models = require('../models');
var async = require('async');
var i18n = require('i18n');
var md5 = require('md5');

exports.syncFactory = syncFactory;
exports.syncUser = syncUser;

/** Sync new factory data. */
function syncFactory (factoryId) {
  async.waterfall([
    /** Checks if hardware default folder is exist */
    function(_callback) {
      models.window_hardware_folders.findOrCreate({
        where: {factory_id: factoryId, name: 'Default'}
      }).then(function() {
        _callback(null);
      }).catch(function() {
        _callback(null);
      });
    },
    /** Checks if glass default folder is exist */
    function(_callback) {
      models.glass_folders.findAll({
        where: {factory_id: factoryId}
      }).then(function(result) {
        if (result.length) {
          _callback(null);
        } else {
          models.glass_folders.create({
            name: i18n.__('Standart'),
            position: 0,
            factory_id: parseInt(factoryId, 10),
            img: '/local_storage/default.png',
            link: '------',
            description: '------',
            modified: new Date()
          }).then(function(result) {
            _updateElementsFolder(result.id.toString(), factoryId);
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        }
      }).catch(function(err) {
        console.log(err);
        _callback(null);
      });
    },
    /** Checks if factory has discounts */
    function(_callback) {
      models.options_discounts.find({
        where: {factory_id: factoryId}
      }).then(function(result) {
        if (result) {
          _callback(null);
        } else {
          models.options_discounts.create({
            factory_id: parseInt(factoryId, 10),
            percents: '{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}'
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        }
      }).catch(function(err) {
        console.log(err);
        _callback(null);
      });
    },
    /** Checks if factory has coefficients */
    function(_callback) {
      models.options_coefficients.find({
        where: {factory_id: factoryId}
      }).then(function(result) {
        if (result) {
          _callback(null);
        } else {
          models.options_coefficients.create({
            factory_id: parseInt(factoryId, 10)
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        }
      }).catch(function(err) {
        console.log(err);
        _callback(null);
      });
    },
    /** Set factory app_token if not exist */
    function(_callback) {
      models.factories.findOne({
        where: {id: factoryId}
      }).then(function(factory) {
        if (factory && factory.app_token) {
          _callback(null);
        } else {
          var appToken = md5(new Date());

          factory.updateAttributes({
            app_token: appToken
          }).then(function() {
            _callback(null);
          }).catch(function(err) {
            console.log(err);
            _callback(null);
          });
        }
      }).catch(function(err) {
        console.log(err);
        _callback(null);
      });
    },
    /** Check if hardware types is exist */
    function (_callback) {
      models.window_hardware_type_ranges.findAll({
        where: {
          factory_id: factoryId
        }
      }).then(function (types) {
        if (types && types.length) return _callback(null);

        var availableTypes = [2, 6, 17, 7, 4];

        async.each(availableTypes, _createHardwareType, function (err) {
          if (err) console.log(err);

          _callback(null);
        });
      }).catch(function (error) {
        console.log(error);
        _callback(null);
      })
    },
    /** check user identificators */
    function (_callback) {
      models.user_identificators.find({
        where: {
          factory_id: factoryId
        }
      }).then(function (factoryIdentificators) {
        if (factoryIdentificators) return _callback(null);

        models.user_identificators.create({
          factory_id: factoryId,
          modified: new Date()
        }).then(function () {
          _callback(null);
        }).catch(function (error) {
          console.log(error);
          _callback(null);
        });
      }).catch(function (error) {
        console.log(error);
        _callback(null);
      });
    },
    function (_callback) {
      models.doors_folders.find({
        where: {
          factory_id: factoryId,
          type: 0
        }
      }).then(function (defaultDolder) {
        if (defaultDolder) return _callback();

        models.doors_folders.create({
          factory_id: factoryId,
          name: 'Default',
          type: 0,
          modified: new Date()
        }).then(function () {
          _callback();
        }).catch(function (error) {
          console.log(error);
          _callback();
        });
      }).catch(function (error) {
        console.log(error);
        _callback();
      });
    }
  ], function(err) {
    // Done
  });

  function _createHardwareType (id, done) {
    models.window_hardware_type_ranges.create({
      factory_id: parseInt(factoryId, 10),
      type_id: parseInt(id, 10),
      max_width: 10000,
      min_width: 1,
      max_height: 10000,
      min_height: 1,
      modified: new Date()
    }).then(function () {
      done();
    }).catch(done)
  }
}

function _updateElementsFolder(id, factoryId) {
  models.elements.findAll({
    where: {factory_id: factoryId}
  }).then(function(elements) {
    if (elements.length) {
      for (var i = 0, len = elements.length; i < len; i++) {
        __setDefaultGlassFolder(id, elements[i]);
      }
    }
  }).catch(function(err) {
    console.log(err);
  });
}

  function __setDefaultGlassFolder(folderId, element) {
    element.updateAttributes({
      glass_folder_id: parseInt(folderId, 10)
    }).catch(function(err) {
      console.log(err);
    });
  }

/** Sync new user data. (Creating default values in users tables.) */
function syncUser(userId) {
  async.waterfall([
    function(_callback) {
      models.users_discounts.create({
        user_id: parseInt(userId, 10)
      }).then(function() {
        _callback(null);
      })
    }
  ], function(err, result) {
    // Done.
  });
}
