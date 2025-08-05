const TaskMarks = (sequelize, DataTypes) => {
    const model = sequelize.define('tasks_marks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        lat: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            primaryKey: true
        },
        lng: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            primaryKey: true
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return model;
};

export default TaskMarks;