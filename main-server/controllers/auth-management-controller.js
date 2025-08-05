import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import SignInDto from "../dtos/auth/sign-in-dto.js";
import authManagementService from "../services/auth/auth-management-service.js";
import RefreshDto from "../dtos/auth/refresh-dto.js";
import AuthDto from "../dtos/auth/auth-dto.js";
import config from "config";
import CookieKeys from "../constants/values/cookie-keys.js";
import LogoutDto from "../dtos/auth/logout-dto.js";

/* Контроллер авторизации */
class AuthManagementController {
    async signIn(req, res, next){
        try{
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new SignInDto(req.body);
            const data = await authManagementService.signIn(body);
            
            res.cookie(CookieKeys.refreshToken, data.refresh_token, {
                httpOnly: true,
                secure: config.get("cookie.secure"),
                maxAge: 30 * 24 * 60 * 60 * 1000,
                domain: config.get("cookie.domain"),
                path: config.get("cookie.path")
            });

            return res.status(200).json(new AuthDto(data));
        }catch(e){
            next(e);
        }
    }

    async logout(req, res, next){
        try{
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new LogoutDto(req.body);
            const data = await authManagementService.logout(body);
            
            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async refreshToken(req, res, next) {
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new RefreshDto(req.body);
            const data = await authManagementService.refreshToken(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }
}

export default new AuthManagementController();