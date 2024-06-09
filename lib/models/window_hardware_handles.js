/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardware_handles', {
    constant_value: {
      type: 'NUMERIC',
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    list_id: {
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
