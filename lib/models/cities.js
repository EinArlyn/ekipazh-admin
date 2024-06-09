/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('cities', {
    price_koef_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name_sync: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code_sync: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_capital: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    long: {
      type: 'NUMERIC',
      allowNull: false
    },
    lat: {
      type: 'NUMERIC',
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transport: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '00'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
