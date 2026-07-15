module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_systems', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        group_id: {
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
        top_id: {
          type: DataTypes.INTEGER,
        },
        right_id: {
          type: DataTypes.INTEGER,
        },
        bottom_id: {
          type: DataTypes.INTEGER,
        },
        left_id: {
          type: DataTypes.INTEGER,
        },
        center_id: {
          type: DataTypes.INTEGER,
        },
        sash_id: {
          type: DataTypes.INTEGER,
        },
        min_w: {
          type: 'NUMERIC',
        },
        max_w: {
          type: 'NUMERIC',
        },
        min_h: {
          type: 'NUMERIC',
        },
        max_h: {
          type: 'NUMERIC',
        },
        edit_grid_w: {
          type: 'NUMERIC',
        },
        edit_grid_h: {
          type: 'NUMERIC',
        },
        direction: {
          type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING,
        },
        img: {
          type: DataTypes.STRING,
        },
    }, {
        timestamps: false
      }
)};