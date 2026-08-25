/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('country_nds', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nds: {
      type: DataTypes.NUMERIC(4, 1),
      allowNull: true
    },
  }, {
    timestamps: false
  });
};
