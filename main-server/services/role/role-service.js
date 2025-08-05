import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import RoleDto from '../../dtos/auth/role-dto.js';

/**
 * Сервис для работы с ролями
 */
class RoleService {
    async getRoleList(userId, ifNotCreate = false, checkExists = true, t = null) {
        if (!checkExists) {
            const user = await db.Users.findOne({
                where: {
                    id: userId
                }
            });

            if (!user) {
                throw ApiError.NotFound("Пользователя не существует");
            }
        }

        // Список ролей из БД
        const rolesDB = await db.UsersRoles.findAll({
            where: {
                users_id: userId
            }
        });

        // Результирующий список ролей
        const roles = [];

        if (ifNotCreate && t && (!rolesDB || (Array.isArray(rolesDB) && (rolesDB.length == 0)))) {
            const roleUser = await db.Roles.findOne({
                where: {
                    value: "user"
                }
            }, { transaction: t });

            if (!roleUser) {
                throw ApiError.InternalServerError("Роли для обычного пользователя не предусмотрено");
            }

            roles.push(new RoleDto(roleUser.dataValues));
        } else {
            for (let i = 0; i < rolesDB.length; i++) {
                const item = await db.Roles.findOne({
                    where: {
                        id: rolesDB[i].dataValues.roles_id
                    }
                });

                if (item && roles.map((value) => value.id).includes(item.id) !== true) {
                    roles.push(new RoleDto(item));
                }
            }
        }

        return roles;
    }
}

export default new RoleService();