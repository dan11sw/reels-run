import ApiError from '../exceptions/api-error.js';
import tokenService from '../services/token/token-service.js';
import db from '../db/index.js';
import oauthService from '../services/token/oauth-service.js';
import jwtService from '../services/token/jwt-service.js';
import CookieKeys from '../constants/values/cookie-keys.js';
import jwt from 'jsonwebtoken';

/**
 * Middleware для проверки активации аккаунта пользователя
 * @param {*} req Запрос от пользователя 
 * @param {*} res Ответ пользователю
 * @param {*} next 
 * @returns 
 */
const activateMiddleware = async function (req, res, next) {
    try {
        const users_id = req.body.users_id;
        const activation = await db.Activations.findOne({
            where: {
                users_id: users_id,
                is_activated: true
            }
        });

        if(!activation){
            return next(ApiError.Forbidden("Необходимо подтвердить аккаунт по почте"));
        }
        
        next();
    } catch (e) {
        return next(ApiError.UnathorizedError());
    }
};

export default activateMiddleware;
