import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const Marks = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.Marks, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
        },
        lng: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы marks, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id', true));

        // Создание отношения одного (marks) ко многим (quests)
        model.hasMany(models.Quests, genForeignKey('marks_id'));
    };

    return model;
};

export default Marks;