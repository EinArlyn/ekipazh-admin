/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pls_grids', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0'
    },
    weight: {
      type: 'NUMERIC',
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size_wave: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false
  });
};
