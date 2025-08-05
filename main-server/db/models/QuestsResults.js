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
const QuestsResults = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.QuestsResults, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        filepath: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы exec_quests, на таблицу users_games
        model.belongsTo(models.ExecQuests, genForeignKey(ForeignKeys.QuestsResults_to_ExecQuests));
    };

    return model;
};

export default QuestsResults;