var models = require('../../../../lib/models');

/**
 * Remove additional color by ID
 */
module.exports = function (req, res) {
  var colorId = req.body.colorId;
  
  models.addition_colors.find({
    where: {
      id: colorId
    }
  }).then(function (folder) {
    console.log('folderDestroy', folder)
    updateLists();
    function updateLists () {
      models.lists.findAll({
        where: { add_color_id: colorId },
      }).then(function (colorLists) {
        if (colorLists.length) {
          for (var i = 0, len = colorLists.length; i < len; i++) {
            _setListToDefaultFolder(colorLists[i]);
          }
          setTimeout(function () {
            _destroyFolder(folder);
          }, 800);
        } else {
          _destroyFolder(folder);
        }
      });
    }
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });

  function _destroyFolder (folder) {
    folder.destroy().then(function () {
      res.send({ status: true });
    }).catch(function (error) {
      console.log(error);
      res.send({ status: false });
    });
  }
};

function _setListToDefaultFolder (list) {
  list.updateAttributes({
    add_color_id: 0
  });
}

