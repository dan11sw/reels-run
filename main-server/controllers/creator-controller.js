import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import securityService from "../services/security/security-service.js";
import AccessDto from "../dtos/security/access-dto.js";
import AccessTokenDto from "../dtos/security/access-token-dto.js";
import UsersIdDto from "../dtos/security/users-id-dto.js";
import GameCreateDto from "../dtos/creator/game-create-dto.js";
import creatorService from "../services/creator/creator-service.js";
import GameDeleteDto from "../dtos/creator/game-delete-dto.js";
import MarkAddInfoDto from "../dtos/creator/mark-add-info-dto.js";
import MarkDeleteInfoDto from "../dtos/creator/mark-delete-info-dto.js";
import GameIdDto from "../dtos/creator/game-id-dto.js";
import GameUpdateDto from "../dtos/creator/game-update-dto.js";

/* Контроллер менеджера контента (создателя) */
class CreatorController {
    async gameCreate(req, res, next) {
        try {
            // Валидация входных данных
            const errors = validationResult(req);

            // Обработка ошибок
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            // Группировка данных в DTO
            const body = new GameCreateDto(req.body);

            // Вызов функции gameCreate из слоя Service
            const data = await creatorService.gameCreate(body);

            // Возвращение ответа на запрос
            return res.status(201).json(data);
        } catch (e) {
            // Передача ошибки далее по цепочке HTTP-запроса, игнорируя при этом выполнение текущего запроса
            next(e);
        }
    }

    async gameUpdate(req, res, next) {
        try {
            // Валидация входных данных
            const errors = validationResult(req);

            // Обработка ошибок
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            // Группировка данных в DTO
            const body = new GameUpdateDto(req.body);

            // Вызов функции gameCreate из слоя Service
            const data = await creatorService.gameUpdate(body);

            // Возвращение ответа на запрос
            return res.status(201).json(data);
        } catch (e) {
            // Передача ошибки далее по цепочке HTTP-запроса, игнорируя при этом выполнение текущего запроса
            next(e);
        }
    }

    async gamesCreated(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await creatorService.gamesCreated(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async marksCreated(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await creatorService.marksCreated(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async gameDelete(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GameDeleteDto(req.body);
            const data = await creatorService.gameDelete(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markAddInfo(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkAddInfoDto(req.body);
            const data = await creatorService.markAddInfo(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markAddImg(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                console.log(errors.array());
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await creatorService.markAddImg(req.file, req.body);

            return res.status(201).json(data);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async gameInfo(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GameIdDto({
                ...req.body,
                ...req.query
            });
            
            const data = await creatorService.gameInfo(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markDeleteInfo(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkDeleteInfoDto(req.body);
            const data = await creatorService.markDeleteInfo(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markDeleteImg(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkDeleteInfoDto(req.body);
            const data = await creatorService.markDeleteImg(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new CreatorController();