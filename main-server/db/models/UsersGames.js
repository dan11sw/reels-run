import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

/**
 * Сборка модели для взаимодействия с таблицей UsersGames (закрепление за игроком конкретной игры)
 * @param {*} sequelize Экземпляр ORM Sequelize
 * @param {*} DataTypes Типы данных
 * @returns Собранная модель для взаимодействия с таблицей UsersGames
 */
const UsersGames = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.UsersGames, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        session_id: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы users_games, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы users_games, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));

        // Создание отношений одного (users_games) ко многим (exex_quests)
        model.hasMany(models.ExecQuests, genForeignKey('users_games_id'));
    };

    return model;
};

export default UsersGames;