import { genForeignKey } from "../../utils/db.js";

const DataPlayers = (sequelize, DataTypes) => {
    const model = sequelize.define('data_players', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (data_players) ко многим (video_shooters)
        model.hasMany(models.VideoShooters, genForeignKey('data_players_id'));

        // Создание внешнего ключа из таблицы data_players, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы data_players, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id', true, false, 'SET NULL'));
    };

    return model;
};

export default DataPlayers;