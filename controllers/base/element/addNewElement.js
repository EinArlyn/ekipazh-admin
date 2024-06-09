var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Add new element
 * @param {object} req.body - See [models/elements]
 */
module.exports = function (req, res) {
  var is_additional = 0, is_virtual = 0, is_optimized = 0;

  parseForm(req, function (err, fields, files) {
    (fields.additional_element === 'on') ? is_additional = 1 : is_additional = 0;
    (fields.virtual_element === 'on') ? is_virtual = 1 : is_virtual = 0;
    (fields.optimization_element === 'on') ? is_optimized = 1 : is_optimized = 0;

    models.elements.create({
      sku: fields.sku,
      name: fields.name,
      element_group_id: parseInt(fields.groups_name),
      currency_id: parseInt(fields.currency_name),
      supplier_id: parseInt(fields.supplier_name),
      margin_id: parseInt(fields.margin),
      waste: 0.00,
      is_optimized: is_optimized,
      is_virtual: is_virtual,
      is_additional: is_additional,
      weight_accounting_unit: parseFloat(fields.weight),
      glass_folder_id: parseInt(fields.glass_folder_name),
      min_width: parseFloat(fields.min_width),
      min_height: parseFloat(fields.min_height),
      max_width: parseFloat(fields.max_width),
      max_height: parseFloat(fields.max_height),
      max_sq: parseFloat(fields.max_sq),
      transcalency: parseFloat(fields.transcalency),
      glass_width: parseInt(fields.glass_width),
      factory_id: parseInt(req.session.user.factory_id),
      price: parseFloat(fields.price),
      amendment_pruning: 0.00,
      modified: new Date(),
      noise_coeff: parseFloat(fields.noise_coeff) || 0.00,
      heat_coeff: parseInt(fields.heat_coeff) || 1,
      lamination_in_id: parseInt(fields.lamination_in),
      lamination_out_id: parseInt(fields.lamination_out)
    }).then(function (newElement) {
      /** Send new element id for loading profile systems and prices */
      var elemId = newElement.id.toString();
      res.status(200);
      res.end(elemId);
      /**/

      models.window_hardware_handles.create({
        element_id       : newElement.id,
        location         : fields.hardware_location,
        constant_value   : parseFloat(fields.furniture_const)
      }).then(function () {
        // Done.
      });
    }).catch(function (error) {
      console.log(error);
    });
  });
}
