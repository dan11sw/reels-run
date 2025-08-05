import { Router } from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middlewares/auth-middleware.js';
import GeocoderValuesDto from '../dtos/geocoder/geocoder-values-dto.js';
import GeocoderAddressDto from '../dtos/geocoder/geocoder-address-dto.js';
import GeocoderRoute from '../constants/routes/geocoder.js';
import geocoderController from '../controllers/geocoder-controller.js';

const router = new Router();

/**
 * Конвертация координат (lat; lng) в строковый адрес
 * @route POST /geocoder/values
 * @group Карты - Функции для работы с картами
 * @operationId geocoderValues
 * @param {GeocoderValuesDto.model} input.body.required Входные данные
 * @returns {GeocoderAddressDto.model} 200 - Адрес по координатам
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    GeocoderRoute.geocoderValues,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1}),
        check('lat', 'latitude должно быть вещественным числовым значением').isFloat(),
        check('lng', 'longtitude должно быть вещественным числовым значением').isFloat(),
        
    ],
    geocoderController.values
);

export default router;