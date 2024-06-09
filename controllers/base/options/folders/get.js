var models = require('../../../../lib/models');

/**
 * Get additional folder by ID
 */
module.exports = function (req, res) {
  var folderId = req.params.id;

  models.addition_folders.find({
    where: {
      id: folderId
    }
  }).then(function (folder) {
    res.send({ status: true, folder: folder });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false });
  });
};
