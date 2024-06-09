/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mounting_rules', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unit_descr: {
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
