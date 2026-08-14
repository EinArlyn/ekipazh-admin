/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('homefash_sends', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: 'NUMERIC',
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    /** sent | dry_run | error */
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    http_status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    offer_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    items_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
