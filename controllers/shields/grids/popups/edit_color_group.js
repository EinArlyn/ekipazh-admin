const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }


    models.pls_profile_colors_groups.findOne({
      where: { id: fields.group_id }
    }).then(function(colorGroup) {
      if (!colorGroup) {
        return res.send({ status: false, message: 'Color group not found' });
      }

      return colorGroup.update({
        name: fields.name,
        position: parseInt(fields.position, 10) || 0,
        description: fields.description || ''
      }).then(function () {
        res.send({ status: true });
      });
    }).catch(function(err) {
      console.error('Error editing color group:', err.message);
      res.send({ status: false, message: err.message });
    });
  });
};
