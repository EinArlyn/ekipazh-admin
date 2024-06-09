/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('options_discounts', {
    percents: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    week_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    base_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    standart_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    min_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};