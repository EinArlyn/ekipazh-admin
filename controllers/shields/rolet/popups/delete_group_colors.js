var models = require('../../../../lib/models/index.js');
var parseForm = require('../../../../lib/services/formParser.js').parseForm;

module.exports = function (req, res) {
  parseForm(req, function (err, fields, files) {
    models.rol_color_groups.findOne({ where: { id: fields.group_id } })
      .then(function (group) {
        if (!group) return res.send({ status: false, error: 'not found' });

        const wasStandard = Number(group.is_standart) === 1;
        const factoryId   = group.factory_id;
        const deletedId   = group.id;

        return group.destroy()
          .then(function () {
            if (!wasStandard) return null; // удалили не стандартную — ок

            // найти любую в той же фабрике, кроме удалённой, и сделать стандартной
            return models.rol_color_groups.findOne({
              where: { factory_id: factoryId, id: { $ne: deletedId } },
              order: [['id', 'ASC']] 
            }).then(function (other) {
              if (!other) return null; 
              return other.update({ is_standart: 1 });
            });
          })
          .then(function () {
            res.send({ status: true });
          });
      })
      .catch(function (e) {
        console.error('delete group error:', e);
        res.send({ status: false });
      });
  });
};