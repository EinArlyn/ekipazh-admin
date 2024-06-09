/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('factories', {
    max_lamination_construct_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_lamination_construct_square: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_construct_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_construct_square: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    therm_coeff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    app_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
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
