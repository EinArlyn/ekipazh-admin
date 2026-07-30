/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'muntins_widths',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      muntins_id: {
        type: DataTypes.INTEGER,
      },
      width: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.NUMERIC(10, 2),
      }
    },
    {
      timestamps: false,
    }
  );
};
