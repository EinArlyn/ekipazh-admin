/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order_addelements', {
    block_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_id: {
      type: 'NUMERIC',
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    element_qty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    element_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_height: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_width: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    element_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
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
