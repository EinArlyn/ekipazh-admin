var models = require('../../../lib/models');

module.exports = function (req, res) {
  var elementId = req.params.id;
  var checked = req.body['checked'].split(',');
  var unchecked = req.body['unchecked'].split(',');

  if (checked.length) {
    for (var i = 0, len = checked.length; i < len; i++) {
      var glassId = parseInt(checked[i], 10);
      if (glassId) {
        _saveGlassesFolder(glassId, elementId);
      }
    }
  }
  if (unchecked.length) {
    for (var k = 0, len2 = unchecked.length; k < len2; k++) {
      var _glassId = parseInt(unchecked[k], 10);
      if (_glassId) {
        _destroyGlassesFolder(_glassId, elementId);
      }
    }
  }
  res.end();
};


function _saveGlassesFolder (glassId, elementId) {
  models.glasses_folders.find({
    where: {
      glass_folders_id: glassId,
      element_id: elementId
    }
  }).then(function (result) {
    if (result) return;

    models.glasses_folders.create({
      glass_folders_id: parseInt(glassId, 10),
      element_id: parseInt(elementId, 10),
    }).then(function (result) {
      return;
    });
  });
}


function _destroyGlassesFolder(glassId, elementId) {
  models.glasses_folders.find({
    where: {
      glass_folders_id: glassId,
      element_id: elementId
    }
  }).then(function (result) {
    if (!result) return;

    result.destroy().then(function () {
      return;
    });
  });
}
