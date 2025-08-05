import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

/**
 * Сборка модели для взаимодействия с таблицей InfoGames
 * @param {*} sequelize Экземпляр ORM Sequelize
 * @param {*} DataTypes Типы данных
 * @returns Собранная модель для взаимодействия с таблицей InfoGames
 */
const InfoGames = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.InfoGames, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание отношений одного (info_games) ко многим (fix_judges)
        model.hasMany(models.FixJudges, genForeignKey('info_games_id'));

        // Создание внешнего ключа из таблицы info_games, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание отношений одного (info_games) ко многим (register_games)
        model.hasMany(models.RegisterCommands, genForeignKey('info_games_id'));

        // Создание отношений одного (info_games) ко многим (games_quests)
        model.hasMany(models.GamesQuests, genForeignKey('info_games_id'));

        // Создание отношений одного (info_games) ко многим (current_games)
        model.hasMany(models.CurrentGames, genForeignKey('info_games_id'));

        // Создание отношений одного (info_games) ко многим (complete_games)
        model.hasMany(models.CompleteGames, genForeignKey('info_games_id'));

        // Создание отношений одного (info_games) ко многим (checked_games)
        model.hasMany(models.CheckedGames, genForeignKey('info_games_id'));

        // Создание отношений одного (info_games) ко многим (queue_games)
        model.hasMany(models.QueueGames, genForeignKey('info_games_id'));
    };

    return model;
};

export default InfoGames;