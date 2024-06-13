/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('directions', {
    modified: {
      type: DataTypes.DATE,
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