import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import securityService from "../services/security/security-service.js";
import AccessDto from "../dtos/security/access-dto.js";
import AccessTokenDto from "../dtos/security/access-token-dto.js";
import UsersIdDto from "../dtos/security/users-id-dto.js";
import GameCreateDto from "../dtos/creator/game-create-dto.js";
import GameDeleteDto from "../dtos/creator/game-delete-dto.js";
import moderatorService from "../services/moderator/moderator-service.js";
import CreatorUsersIdDto from "../dtos/moderator/creator-users-id-dto.js";
import InfoGamesIdDto from "../dtos/moderator/info-games-id-dto.js";
import GameWarningDto from "../dtos/moderator/game-warning-dto.js";
import GameBanDto from "../dtos/moderator/game-ban-dto.js";
import GameUnbanDto from "../dtos/moderator/game-unban-dto.js";

/* Контроллер менеджера контента (создателя) */
class ModeratorController {
    async queueGames(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await moderatorService.queueGames(req.body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async creatorInfo(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CreatorUsersIdDto(req.body);
            const data = await moderatorService.creatorInfo(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async gameInfo(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new InfoGamesIdDto(req.body);
            const data = await moderatorService.gameInfo(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async gameAccepted(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new InfoGamesIdDto(req.body);
            const data = await moderatorService.gameAccepted(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async gamesChecked(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await moderatorService.gamesChecked(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async creatorsList(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await moderatorService.creatorsList(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async gameWarning(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GameWarningDto(req.body);
            const data = await moderatorService.gameWarning(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async gameBan(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GameBanDto(req.body);
            const data = await moderatorService.gameBan(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async gameUnban(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GameUnbanDto(req.body);
            const data = await moderatorService.gameUnban(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }
}

export default new ModeratorController();