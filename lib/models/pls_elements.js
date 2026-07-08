/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pls_elements', {
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
    waste: {
      type: 'NUMERIC',
      allowNull: false,
      defaultValue: '0'
    },    
    amendment_pruning: {
      type: 'NUMERIC',
      allowNull: true
    },
    weight: {
      type: 'NUMERIC',
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false
  });
};
