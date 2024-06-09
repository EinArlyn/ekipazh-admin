/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_identificators', {
    identificator_14: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_13: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_12: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_11: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    identificator_10: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_9: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_8: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_7: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_6: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_5: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_4: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_3: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    identificator_1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factory_id: {
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
