import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { nanoid } from 'nanoid';
import db from '../../db/index.js';
import mailService from '../mail/mail-service.js';
import tokenService from '../token/token-service.js';
import jwtService from '../token/jwt-service.js';
import oauthService from '../token/oauth-service.js';
import ApiError from '../../exceptions/api-error.js';
import TypeServices from '../../constants/values/type-services.js';
import RoleDto from '../../dtos/auth/role-dto.js';
import AttributeDto from '../../dtos/auth/attribute-dto.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import RefreshDto from '../../dtos/auth/refresh-dto.js';
import SignUpDto from '../../dtos/auth/sign-up-dto.js';
import { isUndefinedOrNull } from '../../utils/objector.js';
import roleService from '../role/role-service.js';

/* Сервис авторизации пользователей */
class AuthService {
    /**
     * Регистрация нового пользователя
     * @param {SignUpDto} data Информация о пользователе для регистрации
     * @returns Авторизационные данные пользователя
     */
    async signUp(data) {
        const t = await db.sequelize.transaction();

        try {
            const userEmail = await db.Users.findOne({ where: { email: data.email } });
            if (userEmail) {
                throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} уже существует`);
            }

            if (data.nickname && data.nickname.trim().length > 0) {
                const userNick = await db.DataUsers.findOne({ where: { nickname: data.nickname } });

                if (userNick) {
                    throw ApiError.BadRequest(`Пользователь с никнеймом ${data.nickname} уже существует`);
                }
            }

            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(data.password, 16);
            const user = await db.Users.create({
                email: data.email,
                password: hashedPassword
            }, { transaction: t });

            // Добавление типа авторизации
            await db.AuthTypes.create({
                users_id: user.id,
                type: 0
            }, { transaction: t });

            // Генерация ссылки для активации аккаунта
            const link = uuid();

            await db.Activations.create({
                users_id: user.id,
                is_activated: true,       // [TEST] До этапа тестирования true
                activation_link: link
            }, { transaction: t });

            // Отправка сообщения о активации пользовательского аккаунта
            // [TEST] // await mailService.sendActivationMail(data.email, `${config.get("url.client")}/auth/activate/${link}`);

            // Генерация токенов доступа и обновления
            const tokens = jwtService.generateTokens({
                users_id: user.id,
                type_auth: 0
            });

            // Сохранение токенов в БД
            await tokenService.saveTokens(user.id, tokens.access_token, tokens.refresh_token, t);
            const dateNow = (new Date()).toISOString().slice(0, 10);

            const userNickname = ((isUndefinedOrNull(data.nickname)) || (data.nickname.trim().length == 0)) ? nanoid(12) : data.nickname;

            // Добавление информации о пользователе
            await db.DataUsers.create({
                nickname: userNickname, users_id: user.id,
            }, { transaction: t });

            // Добавление прав доступа
            const role = await db.Roles.findOne({
                where: {
                    value: "user"
                }
            });

            if (!role) {
                throw ApiError.BadRequest("Роли для пользователя не существует");
            }

            const roleCreated = await db.UsersRoles.create({
                users_id: user.id,
                roles_id: role.id
            }, { transaction: t });

            // Добавление информации о игроке (default):
            await db.DataPlayers.create({
                rating: 0, commands_id: null, users_id: user.id
            }, { transaction: t });

            //добавление координат пользователя
            await db.CoordPlayers.create({
                lat: 0, lng: 0, users_id: user.id
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                roles: [(new RoleDto(role))]
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Авторизация пользователя
     * @param {*} data Информация о пользователе для авторизации
     * @returns Авторизационные данные пользователя
     */
    async signIn(data) {
        const t = await db.sequelize.transaction();

        try {
            const user = await db.Users.findOne({ where: { email: data.email } });

            if (!user) {
                throw ApiError.BadRequest(`Аккаунта с почтовым адресом ${data.email} не существует`);
            }

            // Контроль метода авторизации
            const authType = await db.AuthTypes.findOne({
                where: {
                    users_id: user.id
                }
            });

            if (authType.type !== 0) {
                throw ApiError.Forbidden(`Аккаунт с почтовым адресом ${data.email} должен авторизовываться через сервис ${TypeServices[authType.type]}`)
            }

            // Проверка пароля
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                throw ApiError.BadRequest("Неверный пароль, повторите попытку");
            }

            // Результирующий список ролей
            const roles = await roleService.getRoleList(user.id, true, true, t);

            // Генерация токенов доступа и обновления
            const tokens = jwtService.generateTokens({
                users_id: user.id,
                type_auth: 0
            });

            // Сохранение токенов
            await tokenService.saveTokens(user.id, tokens.access_token, tokens.refresh_token, t);

            // Фиксация изменений в БД
            await t.commit();

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                roles: roles
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Выход пользователя из системы
     * @param {*} data Информация о пользователе
     * @returns Результат выхода из системы пользователя
     */
    async logout(data) {
        const t = await db.sequelize.transaction();

        try {
            const isExists = await tokenService.isExistsUser(data.users_id, data.access_token, data.refresh_token, data.type_auth);

            if (!isExists) {
                throw ApiError.BadRequest('Данный пользователь не авторизован');
            }

            if (data.type_auth === 1) {
                await oauthService.removeTokenByAccessToken(access_token);
            }

            await tokenService.removeTokenByUserId(data.users_id, t);
            await t.commit();

            return new SuccessDto(true);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }


    /**
     * Активация аккаунта пользователя
     * @param {string} activationLink Ссылка активации
     * @returns {SuccessDto} Результат активации аккаунта
     */
    async activate(activationLink) {
        const t = await db.sequelize.transaction();
        try {
            const user = await db.Activations.findOne({
                where: {
                    activation_link: activationLink
                }
            });

            if (!user) {
                throw ApiError.BadRequest("По данной ссылке активации аккаунта не обнаружено ни одного пользователя");
            }

            user.is_activated = true;
            await user.save();

            return new SuccessDto(true);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Обновление токена доступа пользователя
     * @param {RefreshDto} data 
     * @returns Авторизационные данные пользователя
     */
    async refreshToken(data) {
        const t = await db.sequelize.transaction();

        try {
            // Декодирование токена обновления (с пользовательскими данными)
            let user = null;
            let refreshToken = data.refresh_token;

            let dataFromToken = jwtService.validateRefreshToken(refreshToken);

            // Обработка ситуации, когда refresh_token не активен
            if (!dataFromToken) {
                refreshToken = null;
                dataFromToken = await tokenService.findUserByRefreshToken(refreshToken, 0);

                if (!dataFromToken) {
                    throw ApiError.NotFound("Пользователь с данным токеном обновления не найден");
                }
            }

            const tokens = jwtService.generateTokens({ users_id: dataFromToken.users_id, type_auth: dataFromToken.type_auth });
            if (!refreshToken) {
                refreshToken = tokens.refresh_token;
            }

            const accessToken = tokens.access_token;

            const roles = await roleService.getRoleList(dataFromToken.users_id);

            if (!accessToken || !refreshToken) {
                throw ApiError.InternalServerError('Возникла непредвиденная ошибка');
            }

            await tokenService.saveTokens(dataFromToken.users_id, accessToken, refreshToken, t);

            await t.commit();

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
                roles: roles
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new AuthService();