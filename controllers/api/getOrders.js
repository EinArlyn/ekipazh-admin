var _ = require('lodash');
var models = require('../../lib/models');

/**
 * Get orders of current user
 * @param {string}  login
 * @param {string}  access_token
 */
module.exports = function (req, res) {
  var tables = {};
  var count = 0;
  var login = req.query.login;
  var access_token = req.query.access_token;
  var type = parseInt(req.query.type, 10) || 1;

  if (type < 1 || type > 3) return res.send({ status: false, error: 'Type value should be 1, 2 or 3.' });

  var ranges = getRanges(type);
  console.log(ranges)

  tables.orders = {
    rows: [],
    fields: ["currency_value", "order_lang", "app_version", "sync_date", "comment", "bill", "customer_floor", "customer_flat", "customer_house", "margin_plant", "disc_term_plant", "default_term_plant", "mounting_user_id", "delivery_user_id", "discount_addelem_max", "discount_construct_max", "customer_city_id", "order_price_dis", "order_number", "order_hz", "floor_price", "addelems_price", "templates_price", "customer_city", "heat_coef_min", "order_type", "order_date", "new_delivery_date", "delivery_date", "state_buch", "state_to", "sended", "modified", "created", "customer_infoSource", "customer_occupation", "customer_education", "customer_age", "customer_sex", "customer_target", "customer_endtime", "customer_starttime", "customer_itn", "discount_addelem", "discount_construct", "order_price_primary", "order_price", "payment_monthly_primary", "payment_first_primary", "payment_monthly", "payment_first", "is_old_price", "instalment_id", "is_instalment", "mounting_id", "floor_id", "is_date_price_more", "is_date_price_less", "products_price", "products_qty", "order_style", "customer_location", "climatic_zone", "user_id", "mounting_price", "delivery_price", "sale_price", "purchase_price", "factory_id", "factory_margin", "customer_address", "customer_email", "customer_name", "customer_phone_city", "base_price", "customer_phone", "batch", "additional_payment", "id"]
  };
  tables.order_products = {
    rows: [],
    fields: ["door_type_index", "door_group_id", "lamination_id", "template_svg", "template_square", "template_height", "template_width", "hardware_id", "modified", "product_qty", "comment", "product_price", "addelem_price", "template_price", "heat_coef_total", "door_lock_shape_id", "door_handle_shape_id", "door_sash_shape_id", "door_shape_id", "lamination_in_id", "lamination_out_id", "glass_id", "profile_id", "template_source", "template_id", "construction_type", "room_id", "is_addelem_only", "product_id", "order_id", "id"]
  };
  tables.order_addelements = {
    rows: [],
    fields: ["block_id", "name", "order_id", "modified", "element_qty", "element_price", "element_height", "element_width", "element_id", "element_type", "product_id", "id"]
  };

  models.users.find({
    where: {
      phone: login,
      device_code: access_token
    }
  }).then(function (user) {
    if (!user) return res.send({ status: false, count: count, error: 'User doesn\'t exist' });

    var userId = user.id;

    models.orders.findAll({
      where: {
        user_id: userId,
        created: {
          $between: [ranges.from, ranges.to]
        }
      },
      include: [{
        model: models.order_products,
        required: false
      }, {
        model: models.order_addelements,
        required: false
      }],
      attributes: ["currency_value", "order_lang", "app_version", "sync_date", "comment", "bill", "customer_floor", "customer_flat", "customer_house", "margin_plant", "disc_term_plant", "default_term_plant", "mounting_user_id", "delivery_user_id", "discount_addelem_max", "discount_construct_max", "customer_city_id", "order_price_dis", "order_number", "order_hz", "floor_price", "addelems_price", "templates_price", "customer_city", "heat_coef_min", "order_type", "order_date", "new_delivery_date", "delivery_date", "state_buch", "state_to", "sended", "modified", "created", "customer_infoSource", "customer_occupation", "customer_education", "customer_age", "customer_sex", "customer_target", "customer_endtime", "customer_starttime", "customer_itn", "discount_addelem", "discount_construct", "order_price_primary", "order_price", "payment_monthly_primary", "payment_first_primary", "payment_monthly", "payment_first", "is_old_price", "instalment_id", "is_instalment", "mounting_id", "floor_id", "is_date_price_more", "is_date_price_less", "products_price", "products_qty", "order_style", "customer_location", "climatic_zone", "user_id", "mounting_price", "delivery_price", "sale_price", "purchase_price", "factory_id", "factory_margin", "customer_address", "customer_email", "customer_name", "customer_phone_city", "base_price", "customer_phone", "batch", "additional_payment", "id"]
    }).then(function (orders) {
      if (!orders || !orders.length) return res.send({ status: true, count: count, tables: tables });

      count = orders.map(function (order) {
        tables.orders.rows.push(_.omit(order.dataValues, ['order_products', 'order_addelements']));

        if (order.dataValues.order_products && order.dataValues.order_products.length) {
          order.dataValues.order_products.map(function (order_product) {
            tables.order_products.rows.push(order_product.dataValues);
          });
        }

        if (order.dataValues.order_addelements && order.dataValues.order_addelements.length) {
          order.dataValues.order_addelements.map(function (order_addelement) {
            tables.order_addelements.rows.push(order_addelement.dataValues);
          });
        }
      }).length;

      sortValues(tables.orders.rows, function (ordersValues) {
        tables.orders.rows = ordersValues;
        sortValues(tables.order_products.rows, function (ordersProductsValues) {
          tables.order_products.rows = ordersProductsValues;
          sortValues(tables.order_addelements.rows, function (ordersAddElementsValues) {
            tables.order_addelements.rows = ordersAddElementsValues;

            res.send({ status: true, count: count, tables: tables });
          });
        });
      });
    });
  }).catch(function (error) {
    console.log(error);
    res.send({ status: false, error: error });
  });
};

function getRanges (type) {
  var today = new Date(new Date().setHours(23, 59, 59, 59));

  if (type === 1) {
    return {
      from: new Date(new Date(new Date(today).setDate(today.getDate() - 7)).setHours(0, 0, 0, 0)),
      to: today
    };
  } else if (type === 2) {
    return {
      from: new Date(new Date(new Date(today).setMonth(new Date(today).getMonth() - 1)).setHours(0, 0, 0, 0)),
      to: today
    };
  } else {
    return {
      from: new Date(new Date(new Date(today).setFullYear(new Date(today).getFullYear() - 1)).setHours(0, 0, 0, 0)),
      to: today,
    };
  }
}

function sortValues(result, __callback) {
  var values = [];

  if (result.length) {
    for (var i = 0, len = result.length; i < len; i++) {
      var _val = Object.keys(result[i]).map(function(key) {return result[i][key];});
      values.push(_val);
      if (i === len - 1) {
        __callback(values);
      }
    }
  } else {
    __callback(values)
  }
}
