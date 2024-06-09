/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('currencies', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_base: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: 'NUMERIC',
      allowNull: false,
      defaultValue: '1'
    },
    name: {
      type: DataTypes.STRING,
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
