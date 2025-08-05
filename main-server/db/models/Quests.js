import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const Quests = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.Quests, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        task: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        action: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        radius: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание отношений один (quests) ко многим (games)
        model.hasMany(models.Games, genForeignKey('quests_id'));

        // Создание внешнего ключа из таблицы marks, на таблицу users
        model.belongsTo(models.Marks, genForeignKey('marks_id'));

        // Создание отношений один (quests) ко многим (games_quests)
        model.hasMany(models.GamesQuests, genForeignKey('quests_id'));

        // Создание отношений один (quests) ко многим (exec_quests)
        model.hasMany(models.ExecQuests, genForeignKey('quests_id'));
    };

    return model;
};

export default Quests;