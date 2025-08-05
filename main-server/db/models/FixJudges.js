import { genForeignKey } from "../../utils/db.js";

const FixJudges = (sequelize, DataTypes) => {
    const model = sequelize.define('fix_judges', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы fix_judges, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы fix_judges, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы fix_judges, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));

        // Создание отношения один (fix_judges) ко многим (judge_scores)
        model.hasMany(models.JudgeScores, genForeignKey('fix_judges_id'));
    };

    return model;
};

export default FixJudges;