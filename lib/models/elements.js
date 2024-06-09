/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('elements', {
    reg_coeff: {
      type: 'NUMERIC',
      allowNull: true
    },
    code_sync: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lamination_out_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lamination_in_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heat_coeff: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    noise_coeff: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amendment_pruning: {
      type: 'NUMERIC',
      allowNull: true
    },
    price: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0'
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    glass_width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transcalency: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.5'
    },
    max_sq: {
      type: 'NUMERIC',
      allowNull: true
    },
    max_height: {
      type: 'NUMERIC',
      allowNull: true
    },
    max_width: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_height: {
      type: 'NUMERIC',
      allowNull: true
    },
    min_width: {
      type: 'NUMERIC',
      allowNull: true
    },
    glass_folder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    weight_accounting_unit: {
      type: 'NUMERIC',
      allowNull: true
    },
    is_additional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    is_virtual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    is_optimized: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    waste: {
      type: 'NUMERIC',
      allowNull: false,
      defaultValue: '0'
    },
    margin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    element_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
