import TableName from "../../constants/table/table-name.js";
import { genForeignKey } from "../../utils/db.js";

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define(TableName.Users, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (users) ко многим (activations)
        model.hasMany(models.Activations, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (users_games)
        //model.hasMany(models.UsersGames, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (auth_types)
        model.hasMany(models.AuthTypes, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (tokens)
        model.hasMany(models.Tokens, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (fix_judges)
        model.hasMany(models.FixJudges, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (checked_games)
        model.hasMany(models.CheckedGames, genForeignKey('users_id', true));

        // Создание отношения одного (users) ко многим (data_users)
        model.hasMany(models.DataUsers, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (users_roles)
        model.hasMany(models.UsersRoles, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (users_groups)
        model.hasMany(models.Roles, genForeignKey('users_id', true));

        // Создание отношения одного (users) ко многим (data_players)
        model.hasMany(models.DataPlayers, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (coord_players)
        model.hasMany(models.CoordPlayers, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (info_games)
        model.hasMany(models.InfoGames, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (commands)
        model.hasMany(models.Commands, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (marks)
        model.hasMany(models.Marks, genForeignKey('users_id', true));

        // Создание отношения одного (users) ко многим (test_marks)
        model.hasMany(models.TestMarks, genForeignKey('users_id'));
    }

    return model;
};

export default Users;