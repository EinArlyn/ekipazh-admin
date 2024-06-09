/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('countries', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
