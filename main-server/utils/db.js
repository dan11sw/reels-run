export const genForeignKey = (name, allowNull = false, unique = false, cascade = 'CASCADE') => {
    return {
        foreignKey: {
            name: name,
            allowNull: allowNull,
            unique: unique,
            onDelete: cascade,
            onUpdate: 'CASCADE'
        }
    }
}