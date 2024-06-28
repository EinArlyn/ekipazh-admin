var models = require('../../../lib/models');

/**
 * Create set from current element
 * @param {string} body.setName - New set name
 * @param {integer} body.groupName - Group name
 * @param {integer} body.elementId - Parent element id
 */
module.exports = function (req, res) {
  var setName = req.body.setName;
  var groupId = req.body.groupName;
  var elementId = req.body.elementId;

  models.lists.create({
    name              : setName,
    list_group_id     : parseInt(groupId, 10),
    list_type_id      : 1,
    a                 : 0.00,
    b                 : 0.00,
    c                 : 0.00,
    d                 : 0.00,
    e                 : 0.00,
    parent_element_id : parseInt(elementId, 10),
    position          : 0,
    add_color_id      : 1,
    addition_folder_id: 0,
    in_door           : 0,
    doorstep_type     : 1,
    glass_type        : 1,
    glass_image       : 1,
    is_push           : 0,
    glass_color       : 1
  }).then(function (result) {
    models.lists.findOne({
      where: {id: result.id}
    }).then(function (list) {
      __updateBeedProfileSystems(list.id, list.parent_element_id);
      res.send(list);
    }).catch(function (error) {
      console.log(error);
    });
  }).catch(function (error) {
    console.log(error);
  });
};

/**
 * Helpers
 * [1] Update beed profile systems
 * [2] Set beed profile systems
 */

/**
 * [1] Update beed profile system
 * @param {integer} listId - List Id
 * @param {integer} elementId - Element Id
 */
function __updateBeedProfileSystems (listId, elementId) {
 models.elements_profile_systems.findAll({
   where: { element_id: elementId },
   attributes: ['profile_system_id']
 }).then(function (profileSystems) {
   if (profileSystems.length) {
     for (var i = 0, len = profileSystems.length; i < len; i++) {
       __setBeedProfileSystems(listId, profileSystems[i].profile_system_id);
     }
   }
 }).catch(function (err) {
   console.log(err);
 });
}

/**
 * [2] Set beed profile systems
 * @param {integer} listId
 * @param {itneger} profileId - Profile system id
 */
function __setBeedProfileSystems (listId, profileId) {
  models.beed_profile_systems.findOne({
    where: {
      list_id: listId,
      profile_system_id: profileId
    }
  }).then(function (result) {
    if (result) {
      // catch if exist from old database
    } else {
      models.beed_profile_systems.create({
        profile_system_id: parseInt(profileId),
        list_id: parseInt(listId),
        glass_width: 0,
        modified: new Date()
      }).then(function () {
        // Done.
      }).catch(function (error){
        console.log(error);
      });
   }
  }).catch(function (error) {
    console.log(error);
  });
}
