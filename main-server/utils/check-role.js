import db from "../db/index.js";
import { isUndefinedOrNull } from "./objector.js";

/**
 * Проверка роли пользователя
 * @param {*} users_id Идентификатор пользователя
 * @param {*} targetPriority Целевой приоритет роли, который должен быть у пользователя
 * @returns 
 */
export async function checkRole(users_id, targetPriority) {
    if (isUndefinedOrNull(users_id) || isUndefinedOrNull(targetPriority) || !Number.isInteger(targetPriority)) {
        return false;
    }

    const userRoles = await db.UsersRoles.findAll({
        where: {
            users_id: users_id
        },
        include: {
            model: db.Roles,
            where: {
                priority: { [db.Sequelize.Op.gte]: targetPriority }
            },
        },
    });

    return (userRoles.length !== 0);

    /*const roles = await usersRolesDB.findAll({
        where: {
            users_id: users_id
        }
    });

    if(!Array.isArray(roles) || roles.length == 0) {
        return false;
    }

    let flag = false;
    for(let i = 0; i < roles.length && !flag; i++) {
        const item = roles[i].dataValues;
        const role = await roleDB.findOne({
            where: {
                id: item.roles_id
            }
        });

        if(role && role.priority >= targetPriority) {
            flag = true;
        }
    }

    return flag;*/
}