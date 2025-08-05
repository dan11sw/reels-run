import GameStatus from "../../constants/status/game-status.js";
import ViewStatus from "../../constants/status/view-status.js";
import ForeignKeys from "../../constants/table/foreign-keys.js";
import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

/**
 * Сборка модели для взаимодействия с таблицей ExecQuests (закрепление за игроком конкретного квеста)
 * @param {*} sequelize Экземпляр ORM Sequelize
 * @param {*} DataTypes Типы данных
 * @returns Собранная модель для взаимодействия с таблицей ExecQuests
 */
const ExecQuests = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.ExecQuests, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: GameStatus.ACTIVE,
            allowNull: false
        },
        view: {
            type: DataTypes.INTEGER,
            defaultValue: ViewStatus.INVISIBLE,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы exec_quests, на таблицу users_games
        model.belongsTo(models.UsersGames, genForeignKey('users_games_id'));

        // Создание внешнего ключа из таблицы exec_quests, на таблицу quests
        model.belongsTo(models.Quests, genForeignKey('quests_id'));

        // Создание внешнего ключа из таблицы exec_quests, на таблицу quests
        model.hasMany(models.QuestsResults, genForeignKey(ForeignKeys.QuestsResults_to_ExecQuests));
    };

    return model;
};

export default ExecQuests;