/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('similarities', {
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
