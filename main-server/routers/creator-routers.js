import { Router } from 'express';
import { check } from 'express-validator';
import CreatorRoute from '../constants/routes/creator.js';
import creatorController from '../controllers/creator-controller.js';
import GameCreateDto from '../dtos/creator/game-create-dto.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import activateMiddleware from '../middlewares/activate-middleware.js';
import GameDeleteDto from '../dtos/creator/game-delete-dto.js';
import GamesCreatedDto from '../dtos/creator/games-created-dto.js';
import MarkAddInfoDto from '../dtos/creator/mark-add-info-dto.js';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import MarkDeleteInfoDto from '../dtos/creator/mark-delete-info-dto.js';
import converterTypeMiddleware from '../middlewares/converter-type-middleware.js';
import GameIdDto from '../dtos/creator/game-id-dto.js';

// Конфигурирование файлового хранилища multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const extFile = ext[ext.length - 1];

        cb(null, `${uuid()}.${extFile}`);
    }
});
const upload = multer({ storage: storage });

const router = new Router();

/**
 * Создание новой игры
 * @route POST /creator/game/create
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorGameCreate
 * @param {GameCreateDto.model} input.body.required Входные данные
 * @returns {GameCreateDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.gameCreate,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('title', 'Наименование игры не может быть пустым').isLength({ min: 1 }),
        check('quests', "Для создания игры необходимо добавить квесты").isArray({ min: 1 })
    ],
    creatorController.gameCreate
);

/**
 * Обновление игры
 * @route POST /creator/game/update
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorGameCreate
 * @param {GameCreateDto.model} input.body.required Входные данные
 * @returns {GameCreateDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.gameUpdate,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('title', 'Наименование игры не может быть пустым').isLength({ min: 1 }),
        check('quests', "Для создания игры необходимо добавить квесты").isArray({ min: 1 })
    ],
    creatorController.gameUpdate
);

/**
 * Просмотр списка созданных конкретным создателем игр
 * @route GET /creator/games/created
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorGamesCreated
 * @returns {Array.<GamesCreatedDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    CreatorRoute.gamesCreated,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    creatorController.gamesCreated
);

/**
 * Просмотр списка созданных конкретным создателем меток
 * @route GET /creator/marks/created
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorGamesCreated
 * @returns {Array.<GamesCreatedDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    CreatorRoute.marksCreated,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    creatorController.marksCreated
);

router.get(
    CreatorRoute.gameInfo,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
    ],
    creatorController.gameInfo
);

/**
 * Удаление игры
 * @route POST /creator/game/delete
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorGameDelete
 * @param {GameDeleteDto.model} input.body.required Входные данные
 * @returns {Array.<GamesCreatedDto>} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.gameDelete,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('info_games_id', 'Некорректный идентификатор игры').isInt({ min: 1 })
    ],
    creatorController.gameDelete
);


/**
 * Добавление новой метки
 * @route POST /creator/mark/add/info
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorMarkAddInfo
 * @param {MarkAddInfoDto.model} input.body.required Входные данные
 * @returns {MarkAddInfoDto.model} 201 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.markAddInfo,
    [
        authMiddleware,
        // activateMiddleware,
        check('title', 'Максимальная длина названия метки не может быть меньше 3 символов')
            .isLength({ min: 3 }),
        check('description', 'Максимальная длина названия метки не может быть меньше 3 символов')
            .isLength({ min: 3 }),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('lat', 'Значение координаты lat должно быть вещественным числом').isFloat(),
        check('lng', 'Значение координаты lng должно быть вещественным числом').isFloat()
    ],
    creatorController.markAddInfo
);

/**
 * Удаление метки
 * @route POST /creator/mark/delete/info
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorMarkDeleteInfo
 * @param {MarkDeleteInfoDto.model} input.body.required Входные данные
 * @returns {MarkDeleteInfoDto.model} 201 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.markDeleteInfo,
    [
        authMiddleware,
        activateMiddleware,
        check('test_marks_id', 'Некорректный идентификатор метки').isInt({ min: 1 })
    ],
    creatorController.markDeleteInfo
);

/**
 * Добавление изображения для метки
 * @route POST /creator/mark/add/img
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorMarkAddImg
 * @param {File} input.param.required Входные данные
 * @returns {number} 201 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.markAddImg,
    [
        authMiddleware,
        // activateMiddleware,
        upload.single("file"),
        authMiddleware,
        converterTypeMiddleware("test_marks_id", "number"),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('test_marks_id', 'Некорректный идентификатор метки').isInt({ min: 1 }),
    ],
    creatorController.markAddImg
);

/**
 * Удаление изображения метки
 * @route POST /creator/mark/delete/img
 * @group Создатель (контент менеджер) - Функции для наполнения контентом
 * @operationId creatorMarkDeleteImg
 * @param {MarkDeleteInfoDto.model} input.body.required Входные данные
 * @returns {MarkDeleteInfoDto.model} 201 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    CreatorRoute.markDeleteImg,
    [
        authMiddleware,
        activateMiddleware,
        check('test_marks_id', 'Некорректный идентификатор метки').isInt({ min: 1 })
    ],
    creatorController.markDeleteImg
);

export default router;