module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_templates', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        construction_type: {
          type: DataTypes.INTEGER,
        },
        open_type: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        position: {
          type: DataTypes.INTEGER,
        },
        is_active: {
          type: DataTypes.INTEGER,
        },
        default_w: {
          type: 'NUMERIC',
        },
        default_h: {
          type: 'NUMERIC',
        },
        work_price: {
          type: 'NUMERIC',
        },
        img: {
          type: DataTypes.STRING,
        },
    }, {
        timestamps: false
      }
)};