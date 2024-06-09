/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('orders', {
    app_version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sync_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    long: {
      type: 'NUMERIC',
      allowNull: true
    },
    lat: {
      type: 'NUMERIC',
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bill: {
      type: 'NUMERIC',
      allowNull: true
    },
    customer_floor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_flat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_house: {
      type: DataTypes.STRING,
      allowNull: true
    },
    margin_plant: {
      type: 'NUMERIC',
      allowNull: false
    },
    disc_term_plant: {
      type: 'NUMERIC',
      allowNull: false
    },
    default_term_plant: {
      type: 'NUMERIC',
      allowNull: false
    },
    mounting_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delivery_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_addelem_max: {
      type: 'NUMERIC',
      allowNull: false
    },
    discount_construct_max: {
      type: 'NUMERIC',
      allowNull: false
    },
    customer_city_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_price_dis: {
      type: 'NUMERIC',
      allowNull: true
    },
    order_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_hz: {
      type: DataTypes.STRING,
      allowNull: true
    },
    floor_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    addelems_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    templates_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    customer_city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    heat_coef_min: {
      type: 'NUMERIC',
      allowNull: true
    },
    order_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    new_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    state_buch: {
      type: DataTypes.DATE,
      allowNull: true
    },
    state_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_infoSource: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_occupation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_education: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_sex: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    customer_target: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_endtime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_starttime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_itn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_addelem: {
      type: 'NUMERIC',
      allowNull: true
    },
    discount_construct: {
      type: 'NUMERIC',
      allowNull: true
    },
    order_price_primary: {
      type: 'NUMERIC',
      allowNull: true
    },
    order_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    payment_monthly_primary: {
      type: 'NUMERIC',
      allowNull: true
    },
    payment_first_primary: {
      type: 'NUMERIC',
      allowNull: true
    },
    payment_monthly: {
      type: 'NUMERIC',
      allowNull: true
    },
    payment_first: {
      type: 'NUMERIC',
      allowNull: true
    },
    is_old_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    instalment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_instalment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mounting_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    floor_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_date_price_more: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_date_price_less: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    products_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    products_qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_style: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    climatic_zone: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mounting_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    delivery_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    sale_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    purchase_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factory_margin: {
      type: 'NUMERIC',
      allowNull: true
    },
    customer_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    customer_email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    customer_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    customer_phone_city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    base_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    customer_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additional_payment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id: {
      type: 'NUMERIC',
      allowNull: false,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
