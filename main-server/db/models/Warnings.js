import { genForeignKey } from "../../utils/db.js";

const Warnings = (sequelize, DataTypes) => {
    const model = sequelize.define('warnings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы warnings, на таблицу checked_games
        model.belongsTo(models.CheckedGames, genForeignKey('checked_games_id'));
    };

    return model;
};

export default Warnings;