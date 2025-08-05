import { Router } from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.js';
import PlayerRoute from '../constants/routes/player.js';
import playerController from '../controllers/player-controller.js';
import PlayerInfoUpdateDto from '../dtos/player/player-info-update-dto.js';
import CommandsIdDto from '../dtos/player/commands-id-dto.js';
import CommandCreateDto from '../dtos/player/command-create-dto.js';
import InfoGamesIdDto from '../dtos/player/info-games-id-dto.js';
import TagDto from '../dtos/player/tag-dto.js';
import CommandJoinCertainDto from '../dtos/player/command-join-certain-dto.js';
import QuestDto from '../dtos/creator/quest-dto.js';
import CommandAddResultDto from '../dtos/player/command-add-result-dto.js';
import JudgeGetInfoDto from '../dtos/player/judge-get-info-dto.js';
import JudgeSetScoreDto from '../dtos/player/judge-set-score-dto.js';
import PlayerInfoDto from '../dtos/player/player-info-dto.js';
import GamesDto from '../dtos/player/game-dto.js';
import PlayerInfoRDto from '../dtos/player/player-info-r-dto.js';
import PlayerStatisticsDto from '../dtos/player/player-statistics-dto.js';
import CommandInfoDto from '../dtos/player/command-info-dto.js';
import CommandPlayersDto from '../dtos/player/command-players-dto.js';
import CurrentGameInfoDto from '../dtos/player/current-game-info-dto.js';
import TagUserInfoDto from '../dtos/player/tag-user-info-dto.js';
import UrlDto from '../dtos/player/url-dto.js';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import PlayerJoinGameDto from '../dtos/player/player-join-game-dto.js';
import converterTypeMiddleware from '../middlewares/converter-type-middleware.js';

// Конфигурирование файлового хранилища multer
const storageIcons = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/icons/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const extFile = ext[ext.length - 1];

        cb(null, `${uuid()}.${extFile}`);
    }
});

const uploadIcons = multer({ storage: storageIcons });

// Конфигурирование файлового хранилища multer (результаты игр)
const storageResults = multer.diskStorage({
    destination: function (req, file, cb) {
        const body = JSON.parse(JSON.stringify(req.body));
        console.log("file: ", );
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const extFile = ext[ext.length - 1];

        cb(null, `${uuid()}.${extFile}`);
    }
});

const uploadResults = multer({ storage: storageResults });

const router = new Router();

/**
 * Получение информации о текущем статусе игры
 * @route GET /player/game/status
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerGameStatus
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.gameStatus,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.gameStatus
);


/**
 * Получение информации обо всех играх, которые существуют в настоящее время
 * @route GET /player/games
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerGames
 * @returns {Array.<GamesDto>} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.games,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.games
);

/**
 * Получение информации о пользователе
 * @route GET /player/info
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerInfo
 * @returns {PlayerInfoDto.model} 200 - Информация о пользователе
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.info,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.info
);

/**
 * Изменение информации о пользователе
 * @route POST /player/info/update
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerInfoUpdate
 * @param {PlayerInfoUpdateDto.model} input.body.required - Новая информация о пользователе
 * @returns {PlayerInfoRDto.model} 200 - Новая информация о пользователе
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.infoUpdate,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('nickname', 'Минимальная длина для никнейма равна 2 символам')
            .isLength({ min: 2 }),
    ],
    playerController.infoUpdate
);


/**
 * Изменение информации о изображении пользователя
 * @route POST /player/info/img/update
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerInfoImgUpdate
 * @param {File} input.param.required Файл с новым изображением пользователя
 * @returns {UrlDto.model} 200 - Ссылка на новое изображение пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.infoImgUpdate,
    [
        authMiddleware,
        // activateMiddleware,
        uploadIcons.single("file"),
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    playerController.infoImgUpdate
);

/**
 * Получение изображения пользователя
 * @route GET /player/info/img
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerInfoImg
 * @returns {UrlDto.model} 200 - Ссылка на новое изображение пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.infoImg,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    playerController.infoImg
);

/**
 * Получение игровой статистики пользователя
 * @route GET /player/statistics
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerStatistics
 * @returns {PlayerStatisticsDto.model} 200 - Статистика пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.statistics,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.statistics
);

/**
 * Получение информации о команде
 * @route POST /player/command
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommand
 * @returns {CommandInfoDto.model} 200 - Информация о команде
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.command,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.command
);

/**
 * Получение информации о игроках в команде
 * @route POST /player/command/players
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandPlayers
 * @param {CommandsIdDto.model} input.body.required - Идентификатор команды
 * @returns {Array.<CommandPlayersDto>} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandPlayers,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandPlayers
);

/**
 * Получение информации о текущей игре, на которую зарегистрирована команда
 * @route POST /player/command/current/game
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandCurrentGame
 * @param {CommandsIdDto.model} input.body.required - Идентификатор команды
 * @returns {CurrentGameInfoDto.model} 200 - Информация о текущей игре
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandCurrentGame,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandCurrentGame
);

/**
 * Получение информации обо всех пройденных играх командой
 * @route POST /player/command/games
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandGames
 * @param {CommandsIdDto.model} input.body.required - Идентификатор команды
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandGames,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandGames
);

/**
 * Получение информации о всех командах, которые зарегистрированы
 * @route GET /player/commands/list
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandList
 * @returns {Array.<CommandInfoDto>} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.commandsList,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandsList
);

/**
 * Выход игрока из команды
 * @route POST /player/command/detach
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandDetach
 * @param {CommandsIdDto.model} input.body.required - Идентификатор команды
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandDetach,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandDetach
);

/**
 * Создание новой команды
 * @route POST /player/command/create
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandCreate
 * @param {CommandCreateDto.model} input.body.required - Создание команды
 * @returns {CommandCreateDto.model} 201 - Информация о команде
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandCreate,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('name', 'Минимальная длина для имени команды равна 2 символам').isLength({ min: 2 })
    ],
    playerController.commandCreate
);

/**
 * Регистрация команды на игру
 * @route POST /player/command/register/game
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandRegisterGame
 * @param {InfoGamesIdDto.model} input.body.required - Информация для регистрации команды на игру
 * @returns {InfoGamesIdDto.model} 201 - Информация о регистрации команды на игру
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandRegisterGame,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор игры').isInt({ min: 1 })
    ],
    playerController.commandRegisterGame
);

/**
 * Получение списка всех доступных игр
 * @route GET /player/command/available/games
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandAvailableGames
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.commandAvailableGames,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandAvailableGames
);

/**
 * Получение списка свободных игроков по тэгу
 * @route POST /player/command/free/list/tag
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandFreeListTag
 * @param {TagDto.model} input.body.required - Тэг для поиска пользователя
 * @returns {Array.<TagUserInfoDto>} 200 - Информация о пользователях
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandFreeListTag,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandFreeListTag
);

/**
 * Приглашение пользователя в команду
 * @route POST /player/command/join/certain
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandJoinCertain
 * @param {CommandJoinCertainDto.model} input.body.required - Информация о пользователе и команде
 * @returns {CommandJoinCertainDto.model} 200 - Информация о пользователе и команде
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandJoinCertain,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('player_users_id', 'Некорректный идентификатор приглашаемого пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор команды').isInt({ min: 1 })
    ],
    playerController.commandJoinCertain
);

/**
 * Получение списка свободных игроков по тэгу
 * @route POST /player/command/join
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandJoin
 * @param {CommandsIdDto.model} input.body.required - Информация о пользователе и команде
 * @returns {CommandsIdDto.model} 200 - Идентификатор команды
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandJoin,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор команды').isInt({ min: 1 })
    ],
    playerController.commandJoin
);

/**
 * Получение списка определенных пользователей по тэгу
 * @route POST /player/find/certain
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerFindCertain
 * @param {TagDto.model} input.body.required - Информация о пользователе и команде
 * @returns {Array.<TagUserInfoDto>} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.findCertain,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.findCertain
);

/**
 * Текущая видео инструкция
 * @route POST /player/command/current/media/instructions
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandCurrentMediaInstructions
 * @param {QuestDto.model} input.body.required - Информация о пользователе и команде
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandCurrentMediaInstructions,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('quests_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.commandCurrentMediaInstructions
);

/**
 * Добавление результата о прохождении задания командой
 * @route POST /player/command/add/result
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerCommandAddResult
 * @param {CommandAddResultDto.model} input.body.required - Информация о пользователе и команде
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.commandAddResult,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('game_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('ref_media', 'Некорректная ссылка на загруженный видеоматериал').isLength({ min: 36 })
    ],
    playerController.commandAddResult
);

/**
 * Получение судьёй информации о выполненном квесте
 * @route POST /player/judge/get/info
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerJudgeGetInfo
 * @param {JudgeGetInfoDto.model} input.body.required - Информация для получения данных о судье
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.judgeGetInfo,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор приглашаемого пользователя').isInt({ min: 1 }),
        check('commands_id', 'Некорректный идентификатор команды').isInt({ min: 1 })
    ],
    playerController.judgeGetInfo
);

/**
 * Добавление оценки выполнения игры
 * @route POST /player/judge/set/score
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerJudgeGetInfo
 * @param {JudgeSetScoreDto.model} input.body.required - Информация для получения данных о судье
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.judgeSetScore,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('score', 'Некорректные баллы для оценки').isInt({ min: 1 }),
        check('finished_games_id', 'Некорректный идентификатор завершённого квеста').isInt({ min: 1 }),
        check('fix_judges_id', 'Некорректный идентификатор судьи').isInt({ min: 1 }),
    ],
    playerController.judgeSetScore
);

/**
 * Получение информации о текущей игре
 * @route GET /player/game/info
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerGameStatus
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    PlayerRoute.gameInfo,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    playerController.playerGameInfo
)

/**
 * Присоединение игрока к конкретной игре
 * @route POST /player/join/game
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerJoinGame
 * @param {PlayerJoinGameDto.model} input.body.required - Информация для получения данных об игре
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.joinGame,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор игры').isInt({ min: 1 }),
    ],
    playerController.playerJoinGame
);

/**
 * Выход игрока из текущей игры
 * @route POST /player/detach/game
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerJoinGame
 * @param {PlayerDetachGameDto.model} input.body.required - Информация для получения данных об игре
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.detachGame,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('session_id', 'Некорректный идентификатор игровой сессии').isUUID("4"),
    ],
    playerController.playerDetachGame
);

/**
 * Завершение определённой игры по игровой сессии
 * @route POST /player/completed/game
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId playerJoinGame
 * @param {PlayerDetachGameDto.model} input.body.required - Информация для получения данных об игре
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.completedGame,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('session_id', 'Некорректный идентификатор игровой сессии').isUUID("4"),
    ],
    playerController.playerCompletedGame
);

/**
 * Добавление результата игры
 * @route POST /player/set/result/game/image
 * @group Игрок - Функции для взаимодействия с игровой механикой
 * @operationId setResultGameImage
 * @param {number} exec_quests_id Идентификатор процесса игровой сессии
 * @param {string} type_result Тип результата (изображение / видео)
 * @param {File} input.param.required Входные данные
 * @returns {number} 201 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    PlayerRoute.setResultGameImage,
    [
        authMiddleware,
        uploadResults.single("file"),
        authMiddleware,
        converterTypeMiddleware("exec_quests_id", "number"),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('exec_quests_id', 'Некорректный идентификатор метки').isInt({ min: 1 }),
    ],
    playerController.playerSetResultGameImage
);

export default router;