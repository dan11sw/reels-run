import { genForeignKey } from "../../utils/db.js";

const JudgeScores = (sequelize, DataTypes) => {
    const model = sequelize.define('judge_scores', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы judge_scores на таблицу finished_games
        model.belongsTo(models.FinishedGames, genForeignKey('finished_games_id', false, true));

        // Создание внешнего ключа из таблицы judge_scores на таблицу fix_judges
        model.belongsTo(models.FixJudges, genForeignKey('fix_judges_id'));
    };

    return model;
};

export default JudgeScores;