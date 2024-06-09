var models = require('../../../../lib/models');

/**
 * Remove additional folder by ID
 */
module.exports = function (req, res) {
  var folderId = req.body.folderId;

  models.addition_folders.find({
    where: {
      id: folderId
    }
  }).then(function (folder) {
    if (parseInt(folder.addition_type_id, 10) === 12) return updateMosquitos();

    updateLists();

    function updateLists () {
      models.lists.findAll({
        where: { addition_folder_id: folderId },
      }).then(function (foldersLists) {
        if (foldersLists.length) {
          for (var i = 0, len = foldersLists.length; i < len; i++) {
            _setListToDefaultFolder(foldersLists[i]);
          }
          setTimeout(function () {
            _destroyFolder(folder);
          }, 800);
        } else {
          _destroyFolder(folder);
        }
      });
    }

    function updateMosquitos () {
      models.mosquitos.findAll({
        where: {
          group_id: folderId
        }
      }).then(function (mosquitos) {
        if (mosquitos && mosquitos.length) {
          for (var j = 0, len1 = mosquitos.length; j < len1; j++) {
            _setMosquitoToDefaultFolder(mosquitos[j]);
          }
        }

        models.mosquitos_singles.findAll({
          where: {
            group_id: folderId
          }
        }).then(function (mosquitosSingles) {
          if (mosquitosSingles && mosquitosSingles.length) {
            for (var k = 0, len2 = mosquitosSingles.length; k < len2; k++) {
              _setMosquitoToDefaultFolder(mosquitosSingles[k]);
            }
          }

          setTimeout(function () {
            _destroyFolder(folder);
          }, 1000);
        }).catch(function (error) {
          console.log(error);
          res.send({ status: false });
        });
      }).catch(function (error) {
        console.log(error);
        res.send({ status: false });
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
    addition_folder_id: 0
  });
}

function _setMosquitoToDefaultFolder (mosquito) {
  mosquito.updateAttributes({
    group_id: 0
  });
}
