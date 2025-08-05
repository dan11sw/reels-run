import { genForeignKey } from "../../utils/db.js";

const FinishedGames = (sequelize, DataTypes) => {
    const model = sequelize.define('finished_games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        ref_image: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы finished_games на таблицу games
        model.belongsTo(models.Games, genForeignKey('games_id', false, true));
    
        // Создание отношения один (finished_games) ко многим (judge_scores)
        model.hasMany(models.JudgeScores, genForeignKey('finished_games_id', false, true));
    };

    return model;
};

export default FinishedGames;