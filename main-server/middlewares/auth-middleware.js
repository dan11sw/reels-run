import ApiError from '../exceptions/api-error.js';
import tokenService from '../services/token/token-service.js';
import db from '../db/index.js';
import oauthService from '../services/token/oauth-service.js';
import jwtService from '../services/token/jwt-service.js';
import CookieKeys from '../constants/values/cookie-keys.js';
import jwt from 'jsonwebtoken';
import { isUndefinedOrNull } from '../utils/objector.js';

/**
 * Middleware для проверки авторизационных данных пользователя
 * @param {*} req Запрос от пользователя 
 * @param {*} res Ответ пользователю
 * @param {*} next 
 * @returns 
 */
const authMiddleware = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.UnathorizedError());
        }

        const authData = authorizationHeader.split(' ');
        const accessToken = authData[1];

        if ((!accessToken) || (authData.length != 2)) {
            return next(ApiError.UnathorizedError());
        }

        const userData = jwtService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnathorizedError());
        }

        const user = await db.Users.findOne({
            where: {
                id: userData.users_id
            }
        });

        if (!user) {
            return next(ApiError.NotFound("Пользователя с данным идентификатором не существует"));
        }

        // Поиск токена доступа по определённому ID пользователя (для предотвращения подделки токенов доступа)
        const findToken = await tokenService.findTokenByAccessToken(userData.users_id, accessToken);

        if (!findToken) {
            return next(ApiError.UnathorizedError());
        }

        /*
        const refreshToken = req.cookies[CookieKeys.refreshToken];

        if (!refreshToken) {
            return next(ApiError.UnathorizedError());
        } 
        */

        // req.body.refresh_token = findToken.refresh_token;

        // Встраивание дополнительных полей в тело запроса
        req.body.users_id = userData.users_id;
        req.body.type_auth = userData.type_auth;

        const contextData = { ...user.dataValues };
        delete contextData.password;

        req.body.context_user_data = contextData;

        next();
    } catch (e) {
        return next(ApiError.UnathorizedError());
    }
};

export default authMiddleware;
