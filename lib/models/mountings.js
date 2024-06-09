/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mountings', {
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mounting_rule_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: 'NUMERIC',
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: '2015-01-06 09:07:46.057159+00'
    }
  }, {
    timestamps: false
  });
};
