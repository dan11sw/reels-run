import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import FlagDto from '../../dtos/response/flag-dto.js';
import tokenService from '../token/token-service.js';

/* Сервис системы безопасности */
class SecurityService {
    /**
     * Проверка доступа пользователя к конкретному функциональному модулю
     * @param {*} data Данные пользователя для проверки
     * @returns 
     */
    async access(data) {
        const t = await db.sequelize.transaction();

        try {
            const candidatModules = await db.UsersModules.findOne({ where: { users_id: data.users_id } });
            const candidatGroup = await db.Roles.findOne({ where: { users_id: data.users_id } });
            let candidatGroupModules = null;

            let resultModules = {
                player: false,
                judge: false,
                creator: false,
                moderator: false,
                manager: false,
                admin: false,
                super_admin: false
            };

            if (candidatGroup && candidatGroup.id) {
                candidatGroupModules = await db.GroupsModules.findOne({ where: { users_groups_id: candidatGroup.id } });
                if (!candidatGroupModules) {
                    throw ApiError.NotFound('В группе пользователей нет данных о доступных модулях данного пользователя');
                } else {
                    resultModules = {
                        player: candidatGroupModules.player,
                        judge: candidatGroupModules.judge,
                        creator: candidatGroupModules.creator,
                        moderator: candidatGroupModules.moderator,
                        manager: candidatGroupModules.manager,
                        admin: candidatGroupModules.admin,
                        super_admin: candidatGroupModules.super_admin
                    };
                }
            }

            if (!candidatModules) {
                throw ApiError.BadRequest('Ошибка при попытки проверки доступа к модулям для незарегистрированного пользователя');
            }

            resultModules[data.name_module] = (resultModules[data.name_module] || candidatModules[data.name_module]);

            // Проверка прав доступа на определённый модуль
            if (resultModules[data.name_module] === false) {
                return (new FlagDto(false));
            }

            return (new FlagDto(true));
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Проверка токена доступа
     * @param {*} data Токен доступа
     * @returns Результат проверки токена доступа на валидность
     */
    async token(data) {
        try {
            const result_verify = await tokenService.checkAccessToken(data.access_token);
            if (!result_verify) {
                return new FlagDto(false);
            }

            return new FlagDto(true);
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Проверка существования пользователя в системе
     * @param {*} data Информация о пользователе
     * @returns Результат проверки существования пользователя в системе
     */
    async userExists(data) {
        try {
            const candidat = await db.Users.findOne({ where: { id: data.users_id } });

            if (!candidat) {
                return new FlagDto(false);
            }

            return new FlagDto(true);
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Проверка доступа пользователя к конкретному функциональному модулю
     * @param {number} usersId Идентификатор пользователя
     * @param {string} module Название модуля
     * @returns Результат проверки доступа пользователя к модулю
     */
    async checkAccessModule(usersId, module) {
        // [linear logic]
        // Получение списка всех доступных модулей для пользователя
        const modules = await db.UsersModules.findOne({ where: { users_id: usersId } });
        if (!modules) {
            return false;
        }

        // Создание начального доступа (к конкретному модулю)
        let access = false || modules[module];

        // Поиск роли пользователя
        const userRole = await db.UsersRoles.findOne({
            where: {
                users_id: usersId
            }
        });

        if (!userRole.users_groups_id) {
            return access;
        }

        // Определение группы пользователя
        const userGroups = await db.Roles.findOne({
            where: {
                id: userRole.users_groups_id
            }
        });

        if (!userGroups) {
            return access;
        }

        const groupModules = await db.GroupsModules.findOne({
            where: {
                users_groups_id: userGroups.id
            }
        });

        if(!groupModules){
            return access;
        }

        access = access || groupModules[module];

        return access;
    }
}

export default new SecurityService();