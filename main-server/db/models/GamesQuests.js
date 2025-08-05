import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const GameQuests = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.GamesQuests, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы games_quests, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));

        // Создание внешнего ключа из таблицы games_quests, на таблицу quests
        model.belongsTo(models.Quests, genForeignKey('quests_id'));
    };

    return model;
};

export default GameQuests;