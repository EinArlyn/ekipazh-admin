module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_boxes', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        rol_group_id: {
          type: DataTypes.INTEGER,
        },
        is_activ: {
          type: DataTypes.INTEGER,
        },
        position: {
          type: DataTypes.INTEGER,
        },
        is_color: {
          type: DataTypes.INTEGER,
        },
        is_split: {
          type: DataTypes.INTEGER,
        },
        is_grid: {
          type: DataTypes.INTEGER,
        },
        is_security: {
          type: DataTypes.INTEGER,
        },
        is_revision: {
          type: DataTypes.INTEGER,
        },
        is_engine: {
          type: DataTypes.INTEGER,
        },
        split_price: {
          type: 'NUMERIC',
        },
        description: {
          type: DataTypes.STRING,
        },
        img: {
          type: DataTypes.STRING,
        },
        min_width: {
          type: 'NUMERIC',
        },
        min_square_price: {
          type: 'NUMERIC',
        },
        pvc_or_alum_front: {
          type: DataTypes.INTEGER,
        },
        pvc_or_alum_back: {
          type: DataTypes.INTEGER,
        },
        pvc_or_alum_top: {
          type: DataTypes.INTEGER,
        },
        pvc_or_alum_bottom: {
          type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false
      }
)};