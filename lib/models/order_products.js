/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order_products', {
    door_type_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    door_group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lamination_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    template_svg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    template_square: {
      type: 'NUMERIC',
      allowNull: true
    },
    template_height: {
      type: 'NUMERIC',
      allowNull: true
    },
    template_width: {
      type: 'NUMERIC',
      allowNull: true
    },
    hardware_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    product_qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    addelem_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    template_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    heat_coef_total: {
      type: 'NUMERIC',
      allowNull: true
    },
    door_lock_shape_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    door_handle_shape_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    door_sash_shape_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    door_shape_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lamination_in_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lamination_out_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glass_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    template_source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    construction_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_addelem_only: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_id: {
      type: 'NUMERIC',
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
