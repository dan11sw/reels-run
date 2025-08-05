import { genForeignKey } from "../../utils/db.js";

const AuthTypes = (sequelize, DataTypes) => {
    const model = sequelize.define('auth_types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы auth_types, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default AuthTypes;