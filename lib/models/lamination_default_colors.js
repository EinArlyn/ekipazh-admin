/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lamination_default_colors', {
    url: {
      type: DataTypes.STRING,
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
