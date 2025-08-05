import ApiError from '../exceptions/api-error.js';
import tokenService from '../services/token/token-service.js';
import db from '../db/index.js';
import oauthService from '../services/token/oauth-service.js';
import jwtService from '../services/token/jwt-service.js';
import CookieKeys from '../constants/values/cookie-keys.js';
import jwt from 'jsonwebtoken';

/**
 * Middleware для конвертации типов
 * @param {*} req Запрос от пользователя 
 * @param {*} res Ответ пользователю
 * @param {*} next 
 * @returns 
 */
const converterTypeMiddleware = function(field, type) {

    return async function (req, res, next) {
        try {
            switch(type){
                case "number": {
                    req.body[field] = Number(req.body[field]);
                    break;
                }
                case "string": {
                    req.body[field] = String(req.body[field]);
                    break;
                }
            }
            
            next();
        } catch (e) {
            return next(ApiError.InternalServerError());
        }
    };
};

export default converterTypeMiddleware;
