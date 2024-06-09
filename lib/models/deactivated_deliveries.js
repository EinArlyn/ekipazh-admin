/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('deactivated_deliveries', {
    delivery_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false
  });
};
