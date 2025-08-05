import { genForeignKey } from "../../utils/db.js";

const RegisterCommands = (sequelize, DataTypes) => {
    const model = sequelize.define('register_commands', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание отношения один (register_commands) ко многим (games)
        model.hasMany(models.Games, genForeignKey('register_commands_id'));

        // Создание внешнего ключа из таблицы register_commands, на таблицу commands
        model.belongsTo(models.Commands, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы register_commands, на таблицу info_games
        model.belongsTo(models.InfoGames, genForeignKey('info_games_id'));
    };

    return model;
};

export default RegisterCommands;