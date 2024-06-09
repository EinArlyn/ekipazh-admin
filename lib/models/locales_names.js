/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('locales_names', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    table_id: {
      type: DataTypes.INTEGER,
    },
    table_attr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ru: {
      type: DataTypes.STRING,
      allowNull: true
    },
    en: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ua: {
      type: DataTypes.STRING,
      allowNull: true
    },
    de: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    it: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    es: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bg: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  });
};
