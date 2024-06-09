/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lamination_colors', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
