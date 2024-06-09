/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('glass_folders', {
    is_base: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    name: {
      type: DataTypes.STRING,
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
