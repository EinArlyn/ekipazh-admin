/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('suppliers', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
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
