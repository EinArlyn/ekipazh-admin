var models = require('../../../lib/models');
var parseForm = require('../../../lib/services/formParser').parseForm;

/**
 * Save element
 * @param {integer} params.id - Current element Id
 */
module.exports = function (req, res) {
  var id = req.params.id;
  var is_additional = 0, is_virtual = 0, is_optimized = 0;
  var lastLocation = '';

  parseForm(req, function (err, fields, files) {
    lastLocation = fields.last_location;
    (fields.additional_element === 'on') ? is_additional = 1 : is_additional = 0;
    (fields.virtual_element === 'on') ? is_virtual = 1 : is_virtual = 0;
    (fields.optimization_element === 'on') ? is_optimized = 1 : is_optimized = 0;

    models.elements.find({
      where: { id: id }
    }).then(function (element) {
      element.updateAttributes({
        sku                     : fields.sku,                           // Атрибут
        name                    : fields.name,                          // Имя
        element_group_id        : parseInt(fields.groups_name, 10),         // Группа
        currency_id             : parseInt(fields.currency_name, 10),       // Валюта
        price                   : parseFloat(fields.price.replace(',', '.')) || 0.00,             // Цена
        glass_folder_id         : parseInt(fields.glass_folder_name, 10),   // Тип стеклопакета
        min_width               : parseInt(fields.min_width, 10) || 0.00,           // Min ширина
        max_width               : parseInt(fields.max_width, 10) || 0.00,           // Max ширина
        min_height              : parseInt(fields.min_height, 10) || 0.00,          // Min высота
        max_height              : parseInt(fields.max_height, 10) || 0.00,          // Max высота
        max_sq                  : parseFloat(fields.max_sq).toFixed(2) || 0.00,              // Max площадь
        transcalency            : parseFloat(fields.transcalency) || 0.00,      // Коэф. теплопроводности
        glass_width             : parseInt(fields.glass_width, 10) || 0,         // Толщина стеклопакета
        noise_coeff             : parseFloat(fields.noise_coeff) || 0.00,               // Шумоизоляция
        //heat_coeff              : parseInt(fields.heat_coeff, 10) || 0,               //
        supplier_id             : parseInt(fields.supplier_name, 10),       // Поставщик
        margin_id               : parseInt(fields.margin, 10) || 1,              // Тип наценки
        //amendment_pruning       : parseFloat(fields.amendment_pruning), // Поправка на обрезку
        //waste                   : parseFloat(fields.waste),             // Отход
        weight_accounting_unit  : parseFloat(fields.weight) || 0.00,            // Вес
        is_additional           : parseInt(is_additional, 10),              // Дополнительный элемент
        is_virtual              : parseInt(is_virtual, 10),                 // Виртуальный элемент
        is_optimized            : parseInt(is_optimized, 10),               // Участвует в оптимизации
        // lamination_in_id        : parseInt(fields.lamination_in, 10),
        // lamination_out_id       : parseInt(fields.lamination_out, 10),
        code_sync: fields.sync_code
      }).then(function () {
        if (lastLocation.length) {
          return res.redirect(lastLocation);
        }

        res.redirect('/base/elements');
      }).catch(function (error) {
        console.log(error);
      });
    }).catch(function (error) {
      console.log(error);
    });
  });
};
