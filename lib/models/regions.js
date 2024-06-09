/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('regions', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    climatic_zone: {
      type: 'NUMERIC',
      allowNull: false
    },
    heat_transfer: {
      type: 'NUMERIC',
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
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
