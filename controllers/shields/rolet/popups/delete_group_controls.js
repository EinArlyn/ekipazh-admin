var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    console.log('>>>>>>>>>>>>>>>>>>>>>DElETE group controls');
    console.log(fields);
    models.rol_controls.findAll({
      where: { rol_control_group_id: fields.group_id}
    }).then(function(group) {
      if (group.length) {
        res.send({ status: false });
      } else {
        models.rol_control_groups.destroy({
          where: {id: fields.group_id}
        }).then(function() {
          res.send({ status: true });
        });
      }
    })
  });
};
