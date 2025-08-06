import { Router } from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.js';
import GeocoderValuesDto from '../dtos/geocoder/geocoder-values-dto.js';
import GeocoderAddressDto from '../dtos/geocoder/geocoder-address-dto.js';
import MapRoute from '../constants/routes/map.js';
import mapController from '../controllers/map-controller.js';
import MarkDto from '../dtos/map/mark-dto.js';
import MarkCreateDto from '../dtos/map/mark-create-dto.js';
import MarkIdDto from '../dtos/map/mark-id-dto.js';

const router = new Router();

/**
 * Создание новой метки на карте
 * @route POST /map/mark/create
 * @group Карты - Функции для работы с картами
 * @operationId mapMarkCreate
 * @param {MarkCreateDto.model} input.body.required Входные данные
 * @returns {MarkCreateDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    MapRoute.markCreate,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('title', 'Значение title не должно быть пустым').isLength({ min: 1 }),
        check('location', 'Значение location не должно быть пустым').isLength({ min: 1 }),
        check('lat', 'Значение latitude должно быть вещественным').isFloat(),
        check('lng', 'Значение longtitude должно быть вещественным').isFloat()

    ],
    mapController.markCreate
);

/**
 * Обновление метки в базе данных
 * @route POST /map/mark/update
 * @group Карты - Функции для работы с картами
 * @operationId mapMarkUpdate
 * @param {MarkCreateDto.model} input.body.required Входные данные
 * @returns {MarkCreateDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    MapRoute.markUpdate,
    [
        authMiddleware,
        check('id', 'Некорректный идентификатор метки').isInt({ min: 1 }),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('title', 'Значение title не должно быть пустым').isLength({ min: 1 }),
        check('location', 'Значение location не должно быть пустым').isLength({ min: 1 }),
        check('lat', 'Значение latitude должно быть вещественным').isFloat(),
        check('lng', 'Значение longtitude должно быть вещественным').isFloat()

    ],
    mapController.markUpdateById
);

/**
 * Удаление метки из базы данных
 * @route POST /map/mark/delete
 * @group Карты - Функции для работы с картами
 * @operationId mapMarkUpdate
 * @param {MarkIdDto.model} input.body.required Входные данные
 * @returns {MarkCreateDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    MapRoute.markDelete,
    [
        authMiddleware,
        check('id', 'Некорректный идентификатор метки').isInt({ min: 1 }),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    mapController.markDeleteById
);

/**
 * Получение всех меток
 * @route GET /map/marks
 * @group Карты - Функции для работы с картами
 * @operationId mapMarks
 * @returns {MarkDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    MapRoute.marks,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    mapController.marks
);

/**
 * Получение всех свободных меток
 * @route GET /map/marks/free
 * @group Карты - Функции для работы с картами
 * @operationId mapMarksFree
 * @returns {MarkDto.model} 200 - Выходные данные
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.get(
    MapRoute.marksFree,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    mapController.marksFree
);

export default router;