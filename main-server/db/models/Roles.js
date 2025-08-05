import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const Roles = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.Roles, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        value: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id', true));
        model.hasMany(models.UsersRoles, genForeignKey('roles_id'));
    };

    return model;
};

export default Roles;