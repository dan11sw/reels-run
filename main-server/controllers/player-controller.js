import config from "config";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import UsersIdDto from "../dtos/security/users-id-dto.js";
import commandService from "../services/player/command-service.js";
import playerService from "../services/player/player-service.js";
import judgeService from "../services/player/judge-service.js";
import PlayerInfoUpdateDto from "../dtos/player/player-info-update-dto.js";
import CommandsIdDto from "../dtos/player/commands-id-dto.js";
import CommandCreateDto from "../dtos/player/command-create-dto.js";
import InfoGamesIdDto from "../dtos/player/info-games-id-dto.js";
import TagDto from "../dtos/player/tag-dto.js";
import CommandJoinCertainDto from "../dtos/player/command-join-certain-dto.js";
import QuestsIdDto from "../dtos/player/quests-id-dto.js";
import CommandAddResultDto from "../dtos/player/command-add-result-dto.js";
import JudgeGetInfoDto from "../dtos/player/judge-get-info-dto.js";
import JudgeSetScoreDto from "../dtos/player/judge-set-score-dto.js";
import PlayerJoinGameDto from "../dtos/player/player-join-game-dto.js";
import PlayerSessionGameDto from "../dtos/player/player-session-game-dto.js";
import SetResultGameDto from "../dtos/player/set-result-game-dto.js";
import RemoveResultGameDto from "../dtos/player/remove-result-game-dto.js";
import { loggerDebug } from "../logger/logger.js";
import PlayerRoute, { PlayerRouteBase } from "../constants/routes/player.js";
import { DateTime } from "luxon";

/* Контроллер игрока */
class PlayerController {
    async gameStatus(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await playerService.gameStatus(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async games(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await playerService.games(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async info(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await playerService.playerInfo(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async infoUpdate(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new PlayerInfoUpdateDto(req.body);
            const data = await playerService.playerInfoUpdate(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async infoImgUpdate(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await playerService.playerInfoImgUpdate(req.file, req.body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    // /api/player/info/img
    async infoImg(req, res, next){
        const currentRoute = `${PlayerRouteBase}${PlayerRoute.infoImg}`;

        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await playerService.playerInfoImg(req.body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async statistics(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await playerService.playerStatistics(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async command(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.command(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandPlayers(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.commandPlayers(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandCurrentGame(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.commandCurrentGame(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandGames(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.commandGames(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandsList(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await commandService.commandsList(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandJoin(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.commandJoin(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandDetach(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandsIdDto(req.body);
            const data = await commandService.commandDetach(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandCreate(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandCreateDto(req.body);
            const data = await commandService.commandCreate(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandRegisterGame(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new InfoGamesIdDto(req.body);
            const data = await commandService.commandRegisterGame(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandAvailableGames(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await commandService.commandAvailableGames(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandFreeListTag(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new TagDto(req.body);
            const data = await commandService.commandFreeListTag(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandJoinCertain(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandJoinCertainDto(req.body);
            const data = await commandService.commandJoinCertain(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async findCertain(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new TagDto(req.body);
            const data = await playerService.playerFindCertain(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandCurrentMediaInstructions(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new QuestsIdDto(req.body);
            const data = await commandService.commandCurrentMediaInstruction(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async commandAddResult(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new CommandAddResultDto(req.body);
            const data = await commandService.commandAddResult(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async judgeGetInfo(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new JudgeGetInfoDto(req.body);
            const data = await judgeService.judgeGetInfo(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async judgeSetScore(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new JudgeSetScoreDto(req.body);
            const data = await judgeService.judgeSetScore(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async playerJoinGame(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new PlayerJoinGameDto(req.body);
            const data = await playerService.playerJoinGame(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async playerGameInfo(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = req.body;
            const data = await playerService.playerGameInfo(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async playerDetachGame(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new PlayerSessionGameDto(req.body);
            const data = await playerService.playerDetachGame(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async playerCompletedGame(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new PlayerSessionGameDto(req.body);
            const data = await playerService.playerCompletedGame(body);

            return res.status(201).json(data);
        }catch(e){
            next(e);
        }
    }

    async playerSetResultGameImage(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }
            
            const body = new SetResultGameDto(req.body);
            const data = await playerService.playerSetResultGame(req.file, body);

            return res.status(201).json(data);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async playerRemoveResultGame(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }
            
            const body = new RemoveResultGameDto(req.body);
            const data = await playerService.playerRemoveResultGame(body);

            return res.status(201).json(data);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

export default new PlayerController();