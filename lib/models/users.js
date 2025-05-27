/* jshint indent: 2 */
var Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    currencies_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    direction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    code_kb: {
      type: DataTypes.STRING,
      allowNull: true
    },
    export_folder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    code_sync: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_sync: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mount_sun: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_sat: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_fri: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_thu: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_wed: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_tue: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    mount_mon: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.00'
    },
    is_all_calcs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_buch: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_employee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_payer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    identificator: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '10'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    updated_at: {
      type: Sequelize.DATE
    },
    created_at: {
      type: Sequelize.DATE
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    device_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    internal_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    base_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '7'
    },
    min_term: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '3'
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING,
      allowNull: true
    },
    legal_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    locked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    stamp_file_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    director: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bank_acc_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mfo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    okpo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    short_id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '--'
    },
    session: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_updated_at: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Date.now()
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps  : false,
    underscored : true
  });
};
