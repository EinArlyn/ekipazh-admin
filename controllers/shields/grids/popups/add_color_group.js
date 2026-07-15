const models = require('../../../../lib/models/index.js');
const parseForm = require('../../../../lib/services/formParser.js').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields) {
      if (err) {
        console.error('parseForm error:', err);
        return res.send({ status: false });
      }

    console.log('fields', fields);
    models.pls_profile_colors_groups.create({
        factory_id: parseInt(req.session.user.factory_id, 10),
        name: fields.name,
        position: parseInt(fields.position, 10) || 0,
        is_active: 1,
    }).then(function() {
      res.send({ status: true });
    }).catch(function(err) {
        console.error('Error creating color group:', err.message);
        res.send({status: false, message: err.message})
    });
  })
};
