import { genForeignKey } from "../../utils/db.js";

const DataUsers = (sequelize, DataTypes) => {
    const model = sequelize.define('data_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nickname: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        photo: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы activations, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default DataUsers;