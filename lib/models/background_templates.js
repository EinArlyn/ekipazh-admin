/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('background_templates', {
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    desc_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    desc_1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    img: {
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
