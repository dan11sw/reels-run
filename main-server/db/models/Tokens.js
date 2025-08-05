import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const Tokens = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.Tokens, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        access_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы tokens, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default Tokens;