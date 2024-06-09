/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('areas', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    region_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
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
