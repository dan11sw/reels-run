import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const UsersRoles = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.UsersRoles, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы users_roles, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы users_roles, на таблицу roles
        model.belongsTo(models.Roles, genForeignKey('roles_id'));
    };

    return model;
};

export default UsersRoles;