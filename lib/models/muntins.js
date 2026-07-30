/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'muntins',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type_id: {
        type: DataTypes.INTEGER,
      },
      factory_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: '0',
      },
      price: {
        type: DataTypes.NUMERIC(10, 2),
      },
      is_active: {
        type: DataTypes.INTEGER,
      },
      min_gap: {
        type: DataTypes.INTEGER,
      },
      img: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency_id: {
          type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );
};
