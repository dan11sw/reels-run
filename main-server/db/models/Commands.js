import { genForeignKey } from "../../utils/db.js";

const Commands = (sequelize, DataTypes) => {
    const model = sequelize.define('commands', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        date_register: {
            type: DataTypes.DATE,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (commands) ко многим (fix_judges)
        model.hasMany(models.FixJudges, genForeignKey('commands_id'));

        // Создание отношения одного (commands) ко многим (games)
        model.hasMany(models.Games, genForeignKey('commands_id'));

        // Создание внешнего ключа из таблицы commands, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание отношения одного (commands) ко многим (data_players)
        model.hasMany(models.DataPlayers, genForeignKey('commands_id', true, false, 'SET NULL'));

        // Создание отношения одного (commands) ко многим (register_commands)
        model.hasMany(models.RegisterCommands, genForeignKey('commands_id'));

        // Создание отношения одного (commands) ко многим (current_games)
        model.hasMany(models.CurrentGames, genForeignKey('commands_id'));

        // Создание отношения одного (commands) ко многим (complete_games)
        model.hasMany(models.CompleteGames, genForeignKey('commands_id'));
    };

    return model;
};

export default Commands;