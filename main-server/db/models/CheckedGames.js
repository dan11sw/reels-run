import { genForeignKey } from "../../utils/db.js";

const CheckedGames = (sequelize, DataTypes) => {
    const model = sequelize.define('checked_games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы checked_games, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id', true));

        // Создание внешнего ключа из таблицы checked_games, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));

        // Создание отношения один (checked_games) ко многим (warnings)
        model.hasMany(models.Warnings, genForeignKey("checked_games_id"));

        // Создание отношения один (checked_games) ко многим (bans)
        model.hasMany(models.Bans, genForeignKey("checked_games_id"));
    };

    return model;
};

export default CheckedGames;