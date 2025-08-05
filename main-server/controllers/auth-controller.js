import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import SignUpDto from "../dtos/auth/sign-up-dto.js";
import SignInDto from "../dtos/auth/sign-in-dto.js";
import authService from "../services/auth/auth-service.js";
import RefreshDto from "../dtos/auth/refresh-dto.js";
import AuthDto from "../dtos/auth/auth-dto.js";
import config from "config";
import CookieKeys from "../constants/values/cookie-keys.js";
import LogoutDto from "../dtos/auth/logout-dto.js";
import FlagDto from "../dtos/response/flag-dto.js";

/* Контроллер авторизации */
class AuthController {
    async signUp(req, res, next) {
        try {
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new SignUpDto(req.body);
            const data = await authService.signUp(body);

            // Установка файлов cookie
            res.cookie(CookieKeys.refreshToken, data.refresh_token, {
                httpOnly: true,
                secure: config.get("cookie.secure"),
                maxAge: 30 * 24 * 60 * 60 * 1000,
                domain: config.get("cookie.domain"),
                path: config.get("cookie.path")
            });

            return res.status(201).json(new AuthDto(data));
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async signIn(req, res, next) {
        try {
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new SignInDto(req.body);
            const data = await authService.signIn(body);

            res.cookie(CookieKeys.refreshToken, data.refresh_token, {
                httpOnly: true,
                secure: config.get("cookie.secure"),
                maxAge: 30 * 24 * 60 * 60 * 1000,
                domain: config.get("cookie.domain"),
                path: config.get("cookie.path")
            });

            return res.status(200).json(new AuthDto(data));
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new LogoutDto(req.body);
            const data = await authService.logout(body);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const { activation_link } = req.body;
            const data = await authService.activate(activation_link);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new RefreshDto(req.body);
            const data = await authService.refreshToken(body);

            if (!res.cookie[CookieKeys.refreshToken]) {
                res.cookie(CookieKeys.refreshToken, data.refresh_token, {
                    httpOnly: true,
                    secure: config.get("cookie.secure"),
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    domain: config.get("cookie.domain"),
                    path: config.get("cookie.path")
                });
            }

            return res.status(201).json(new AuthDto(data));
        } catch (e) {
            next(e);
        }
    }

    async verification(req, res, next){
        try {
            return res.status(200).json(new FlagDto(true));
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();