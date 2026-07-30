var models = require('../../../lib/models/index.js');
var parseForm = require('../../../lib/services/formParser.js').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    if (err) {
      console.error('parseForm error:', err);
      return res.send({ status: false });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>delete system');
    console.log(fields);

    var systemId = parseInt(fields.system_id, 10);
    if (!systemId) {
      return res.send({ status: false, error: 'system_id required' });
    }

    models.muntins
      .destroy({
        where: { id: systemId },
      })
      .then(function () {
        return Promise.all([
          models.muntins_profile_links.destroy({
            where: { muntins_id: systemId },
          }),
          models.muntins_pt_profile_links.destroy({
            where: { muntins_id: systemId },
          }),
          models.muntins_widths.destroy({
            where: { muntins_id: systemId },
          }),
        ]);
      })
      .then(function () {
        res.send({ status: true });
      })
      .catch(function (error) {
        console.error('Delete muntins error:', error);
        res.send({ status: false });
      });
  });
};
