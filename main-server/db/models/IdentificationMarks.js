const IdentificationMarks = (sequelize, DataTypes) => {
    const model = sequelize.define('identification_marks', {
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
        },
        radius: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        ref_image: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date_create: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return model;
};

export default IdentificationMarks;