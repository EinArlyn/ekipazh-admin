/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('discounts', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    value: {
      type: 'NUMERIC',
      allowNull: true
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max: {
      type: 'NUMERIC',
      allowNull: true
    },
    min: {
      type: 'NUMERIC',
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
