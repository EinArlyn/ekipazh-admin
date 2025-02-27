/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('lamination_folders', {
      position: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: '0'
      },
      factory_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
  