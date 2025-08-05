const QueueGames = (sequelize, DataTypes) => {
    const model = sequelize.define('queue_games', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return model;
};

export default QueueGames;