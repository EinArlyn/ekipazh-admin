/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users_discounts', {
    week_8_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_8_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_7_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_7_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_6_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_6_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_5_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_5_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_4_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_4_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_3_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_3_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_2_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_2_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_1_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    week_1_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    default_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    default_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    max_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    max_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    user_id: {
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