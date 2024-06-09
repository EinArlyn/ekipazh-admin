/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('options_coefficients', {
    piece_currencies: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    piece_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    perimeter_currencies: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    perimeter_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    area_currencies: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_price: {
      type: 'NUMERIC',
      allowNull: false
    },
    coeff: {
      type: 'NUMERIC',
      allowNull: true
    },
    margin: {
      type: 'NUMERIC',
      allowNull: true
    },
    plan_production: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentability_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentability_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rentability_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    others_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    others_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    others_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transport_cost_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transport_cost_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transport_cost_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_manager_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_manager_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_manager_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_offices_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_offices_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_offices_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_itr_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_itr_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_itr_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_production_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_production_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rent_production_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_glass_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_glass_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_glass_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_assembly_percent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_assembly_hrn_m: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_assembly_hrn: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estimated_cost: {
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