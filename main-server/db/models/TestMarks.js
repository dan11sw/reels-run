import { genForeignKey } from "../../utils/db.js";

const TestMarks = (sequelize, DataTypes) => {
    const model = sequelize.define('test_marks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        lng: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ref_img: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы test_marks, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    }

    return model;
};

export default TestMarks;