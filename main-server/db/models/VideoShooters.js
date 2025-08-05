import { genForeignKey } from "../../utils/db.js";

const VideoShooters = (sequelize, DataTypes) => {
    const model = sequelize.define('video_shooters', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы video_shooters, на таблицу games
        model.belongsTo(models.Games, genForeignKey('games_id'));

        // Создание внешнего ключа из таблицы video_shooters, на таблицу data_players
        model.belongsTo(models.DataPlayers, genForeignKey('data_players_id'));
    };

    return model;
};

export default VideoShooters;