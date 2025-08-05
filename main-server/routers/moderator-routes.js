import { Router } from 'express';
import { check } from 'express-validator';
import ModeratorRoute from '../constants/routes/moderator.js';
import GameCreateDto from '../dtos/creator/game-create-dto.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import GameDeleteDto from '../dtos/creator/game-delete-dto.js';
import GamesCreatedDto from '../dtos/creator/games-created-dto.js';
import moderatorController from '../controllers/moderator-controller.js';
import QueueGamesDto from '../dtos/moderator/queue-games-dto.js';
import CreatorUsersIdDto from '../dtos/moderator/creator-users-id-dto.js';
import CreatorInfoRDto from '../dtos/moderator/creator-info-r-dto.js';
import InfoGamesIdDto from '../dtos/moderator/info-games-id-dto.js';
import GameInfoDto from '../dtos/moderator/game-info-dto.js';
import GameWarningDto from '../dtos/moderator/game-warning-dto.js';
import GameBanDto from '../dtos/moderator/game-ban-dto.js';
import GameUnbanDto from '../dtos/moderator/game-unban-dto.js';

const router = new Router();

/**
 * Создание новой игры
 * @route GET /moderator/queue/games
 * @group Модератор - Функции для модератора
 * @operationId moderatorQueueGames
 * @returns {Array.<QueueGamesDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.queueGames,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.queueGames
);

/**
 * Получение информации о создателе
 * @route POST /moderator/creator/info
 * @group Модератор - Функции для модератора
 * @operationId moderatorCreatorInfo
 * @param {CreatorUsersIdDto.model} input.body.required Входные данные
 * @returns {CreatorInfoRDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.creatorInfo,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('creator_users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.creatorInfo
);

/**
 * Получение информации об игре
 * @route POST /moderator/game/info
 * @group Модератор - Функции для модератора
 * @operationId moderatorGameInfo
 * @param {InfoGamesIdDto.model} input.body.required Входные данные
 * @returns {GameInfoDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gameInfo,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gameInfo
);

/**
 * Одобрение игры
 * @route POST /moderator/game/accepted
 * @group Модератор - Функции для модератора
 * @operationId moderatorGameAccepted
 * @param {InfoGamesIdDto.model} input.body.required Входные данные
 * @returns {InfoGamesIdDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gameAccepted,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gameAccepted
);

/**
 * Список проверенных игр модератором
 * @route GET /moderator/games/checked
 * @group Модератор - Функции для модератора
 * @operationId moderatorGamesChecked
 * @returns {Array.<GamesCheckedDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gamesChecked,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gamesChecked
);

/**
 * Список создателей
 * @route GET /moderator/creators/list
 * @group Модератор - Функции для модератора
 * @operationId moderatorCreatorsList
 * @returns {Array.<GamesCheckedDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.creatorsList,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.creatorsList
);

/**
 * Выдача предупреждения игре
 * @route POST /moderator/game/warning
 * @group Модератор - Функции для модератора
 * @operationId moderatorGameWarning
 * @param {GameWarningDto.model} input.body.required - Входные данные
 * @returns {GameWarningDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gameWarning,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gameWarning
);

/**
 * Блокировка игры
 * @route POST /moderator/game/ban
 * @group Модератор - Функции для модератора
 * @operationId moderatorGameBan
 * @param {GameBanDto.model} input.body.required - Входные данные
 * @returns {GameBanDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gameBan,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gameBan
);

/**
 * Разблокировка игры
 * @route POST /moderator/game/unban
 * @group Модератор - Функции для модератора
 * @operationId moderatorGameUnban
 * @param {GameUnbanDto.model} input.body.required - Входные данные
 * @returns {GameUnbanDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    ModeratorRoute.gameUnban,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    moderatorController.gameUnban
);

export default router;