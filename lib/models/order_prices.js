/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order_prices', {
    discount_addelem: {
      type: 'NUMERIC',
      allowNull: false
    },
    discount_construct: {
      type: 'NUMERIC',
      allowNull: false
    },
    is_own: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery: {
      type: 'NUMERIC',
      allowNull: false
    },
    mounting: {
      type: 'NUMERIC',
      allowNull: false
    },
    sale_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    base_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    margin_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    purchase_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: 'NUMERIC',
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
