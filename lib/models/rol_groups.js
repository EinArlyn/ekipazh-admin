module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_groups', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        factory_id: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        is_activ: {
          type: DataTypes.INTEGER,
        },
        position: {
          type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING,
        },
        img: {
          type: DataTypes.STRING,
        },
        currency_id: {
          type: DataTypes.INTEGER,
        },
        for_type: {
          type: DataTypes.TEXT,
        },
        name_front: {
          type: DataTypes.STRING,
        },
        name_back: {
          type: DataTypes.STRING,
        },
        name_top: {
          type: DataTypes.STRING,
        },
        name_bottom: {
          type: DataTypes.STRING,
        },
    }, {
        timestamps: false
      }
)};