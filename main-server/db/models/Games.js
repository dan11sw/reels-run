import { genForeignKey } from "../../utils/db.js";

const Games = (sequelize, DataTypes) => {
    const model = sequelize.define('games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        view: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (games) ко многим (video_shooters)
        model.hasMany(models.VideoShooters, genForeignKey('games_id'));

        // Создание внешнего ключа из таблицы games, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы games, на таблицу register_commands
        model.belongsTo(models.RegisterCommands, genForeignKey('register_commands_id'));

        // Создание внешнего ключа из таблицы games, на таблицу quests
        model.belongsTo(models.Quests, genForeignKey('quests_id'));

        // Создание отношения одного (games) ко многим (finished_games)
        model.hasMany(models.FinishedGames, genForeignKey('games_id', false, true));
    };

    return model;
};

export default Games;