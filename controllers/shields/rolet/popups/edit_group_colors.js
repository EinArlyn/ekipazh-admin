var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;
var loadImage = require('../../../../lib/services/imageLoader.js').loadImage;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_color_groups.findOne({
      where: { id: parseInt(fields.group_id, 10) }
    }).then(function (group) {
      if (!group) {
        res.send({ status: false, message: 'Group not found' });
        return;
      }
      group.update({
        name: fields.name,
        position: parseInt(fields.position, 10),
        img: fields.colorGroup
      }).then(function () {
        res.send({ status: true, message: 'Group updated successfully' });
      }).catch(function (err) {
        res.send({ status: false, message: 'Error updating group' });
      })
    }).catch(function (err) {
      res.send({ status: false, message: 'Error finding group' });
    });
  });
};
