/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('glass_prices', {
    table_width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    col_5_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_5_range: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_4_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_4_range_2: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_4_range_1: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_3_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_3_range_2: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_3_range_1: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_2_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_2_range_2: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_2_range_1: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_1_price: {
      type: 'NUMERIC',
      allowNull: true
    },
    col_1_range: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
