import { genForeignKey } from "../../utils/db.js";

const CompleteGames = (sequelize, DataTypes) => {
    const model = sequelize.define('complete_games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        current_score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы complete_games, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы complete_games, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));
    };

    return model;
};

export default CompleteGames;