var models = require('../../../lib/models');
var i18n = require('i18n');

/**
 * Validate headers before creating element
 * @param {integer} params.id - Element id
 * @param {string} query.sku - Element sku
 * @param {string} query.name - Element name
 */
module.exports = function (req, res) {
  var elementId = req.params.id;
  var sku = req.query.sku;
  var name = req.query.name;
  var factoryId = req.session.user.factory_id;

  __validateHeaders(elementId, sku, name, factoryId, function (error, data) {
    if (error) return res.send({
      status: false,
      error: error
    });

    res.send(data);
  });
};

/**
 * Helpers
 * [1] Validate headers
 */

/**
 * [1] Validate headers
 */
function __validateHeaders (elementId, sku, name, factoryId, callback) {
  models.elements.findAll({
    where: {
      id: {
        $ne: elementId
      },
      sku: sku,
      factory_id: factoryId
    },
    attributes: ['id', 'sku', 'name']
  }).then(function (elementWithSku) {
    if (elementWithSku.length) {
      callback(null, {
        status: true,
        validate: false,
        notvalid: i18n.__('Element with current sku already exists')
      });
    } else {
      models.elements.findAll({
        where: {
          id: {
            $ne: elementId
          },
          name: name,
          factory_id: factoryId
        },
        attributes: ['id', 'sku', 'name']
      }).then(function (elementWithName) {
        if (elementWithName.length) {
          callback(null, {
            status: true,
            validate: false,
            notvalid: i18n.__('Element with current sku already exists')
          });
        } else {
          callback(null, {
            status: true, validate: true
          });
        }
      }).catch(function (error) {
        console.log(error);
        callback(error);
      });
    }
  }).catch(function (error) {
    console.log(error);
    callback(error);
  });
}
