/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('orders_contents', {
    additional_elements: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scheme: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: 'NUMERIC',
      allowNull: true
    },
    width: {
      type: 'NUMERIC',
      allowNull: true
    },
    square: {
      type: 'NUMERIC',
      allowNull: true
    },
    air_coeff: {
      type: 'NUMERIC',
      allowNull: true
    },
    heat_coeff: {
      type: 'NUMERIC',
      allowNull: true
    },
    additional_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    base_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    lamination_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
