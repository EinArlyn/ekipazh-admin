var models = require('../../../lib/models');

/**
 * Set element profile systems
 * @param {integer} params.id - Element id
 * @param {string} body.checked - Checked element's profile systems
 * @param {string} body.unchecked - Unchecked element's profile systems
 */
module.exports = function (req, res) {
  var elementId = req.params.id;
  var checked = req.body['checked'].split(',');
  var unchecked = req.body['unchecked'].split(',');

  if (checked.length) {
    for (var i = 0, len = checked.length; i < len; i++) {
      var profileId = parseInt(checked[i], 10);
      if (profileId) {
        _saveProfileSystem(profileId, elementId);
      }
    }
  }
  if (unchecked.length) {
    for (var k = 0, len2 = unchecked.length; k < len2; k++) {
      var _profileId = parseInt(unchecked[k], 10);
      if (_profileId) {
        _destroyProfileSystem(_profileId, elementId);
      }
    }
  }
  res.end();
};

/**
 * Helpers
 * [1] Save profile systems for element
 * [2] Destroy profile systems for element
 * [3] Destroy beeds profile systems
 */

/**
 * [1] Save profile systems for element
 * @param {integer} profileId - Profile system Id
 * @param {integer} elementId - Element Id
 */
function _saveProfileSystem (profileId, elementId) {
  /** set profile system for elements */
  models.elements_profile_systems.find({
    where: {
      profile_system_id: profileId,
      element_id: elementId
    }
  }).then(function (result) {
    if (result) return;

    models.elements_profile_systems.create({
      profile_system_id: parseInt(profileId, 10),
      element_id: parseInt(elementId, 10),
      modified: new Date()
    }).then(function (result) {
      return;
    });
  });
  /** set profile systems for beeds */
  models.lists.findAll({
    where: { parent_element_id: elementId },
    attributes: ['id', 'name']
  }).then(function (lists) {
    if (lists.length) {
      for (var i = 0, len = lists.length; i < len; i++) {
        __setBeedProfileSystems(lists[i].id, profileId);
      }
    }
  }).catch(function (error) {
    console.log(error);
  });
}

/**
 * [2] Destroy element's profile systems
 * @param {integer} profileId - Profile system id
 * @param {integer} elementId - Element id
 */
function _destroyProfileSystem(profileId, elementId) {
  models.elements_profile_systems.find({
    where: {
      profile_system_id: profileId,
      element_id: elementId
    }
  }).then(function (result) {
    if (!result) return;

    result.destroy().then(function () {
      return;
    });
  });
  /** destroy profile systems for beeds */
  models.lists.findAll({
    where: { parent_element_id: elementId },
    attributes: ['id', 'name']
  }).then(function (lists) {
    if (lists.length) {
      for (var i = 0, len = lists.length; i < len; i++) {
        __destroyBeedProfileSystems(lists[i].id, profileId);
      }
    }
  }).catch(function(error) {
    console.log(error);
  });
}

/**
 * [3] Destroy beeds profile systems
 * @param {integer} listId - List id
 * @param {integer} profileId - Profile system id
 */
function __destroyBeedProfileSystems (listId, profileId) {
  models.beed_profile_systems.findOne({
    where: {
      list_id: listId,
      profile_system_id: profileId
    }
  }).then(function (result) {
    if (!result) return;

    result.destroy().then(function (){
      // Done.
    }).catch(function (error){
      console.log(error);
    });
  }).catch(function (error) {
    console.log(error);
  });
}
