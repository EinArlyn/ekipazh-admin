/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('profile_prices', {
    two_sided_lamination: {
      type: 'NUMERIC',
      allowNull: true
    },
    inner_lamination: {
      type: 'NUMERIC',
      allowNull: true
    },
    outer_lamination: {
      type: 'NUMERIC',
      allowNull: true
    },
    white_color: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_id: {
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
