import { genForeignKey } from "../../utils/db.js";

const CurrentGames = (sequelize, DataTypes) => {
    const model = sequelize.define('current_games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы current_games, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы current_games, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));
    };

    return model;
};

export default CurrentGames;