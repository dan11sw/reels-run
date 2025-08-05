import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import authManagementController from '../controllers/auth-management-controller.js';
import AuthRoute from '../constants/routes/auth.js';
import AuthDto from '../dtos/auth/auth-dto.js';
import ApiError from '../exceptions/api-error.js';
import SuccessDto from '../dtos/response/success-dto.js';
import ActivationLinkDto from '../dtos/auth/activation-link-dto.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import LogoutDto from '../dtos/auth/logout-dto.js';
import RefreshDto from '../dtos/auth/refresh-dto.js';
import FlagDto from '../dtos/response/flag-dto.js';

const router = new Router();

/**
 * Регистрация пользователя
 * @route POST /auth/sign-up
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {SignUpDto.model} input.body.required Входные данные
 * @returns {AuthDto.model} 201 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.signUp,
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Минимальная длина пароля должна быть 6 символов, а максимальная длина пароля - 32 символа')
            .isLength({ min: 6, max: 32 })
    ],
    authController.signUp
);

/**
 * Авторизация пользователя
 * @route POST /auth/sign-in
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {SignInDto.model} input.body.required Входные данные
 * @returns {AuthDto.model} 200 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.signIn,
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Минимальная длина пароля должна быть 6 символов')
            .isLength({ min: 6 }),
        check('password', 'Максимальная длина пароля равна 30 символам')
            .isLength({ max: 30 })
    ],
    authController.signIn
);

/**
 * Выход пользователя из системы
 * @route POST /auth/logout
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {LogoutDto.model} input.body.required Входные данные
 * @returns {SuccessDto.model} 200 - Флаг, определяющий успех операции выхода пользователя из системы
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.logout,
    [
        authMiddleware,
        check('type_auth', 'Некорректные данные для выхода из системы').isInt(),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    authController.logout
);

/**
 * Авторизация пользователя
 * @route POST /auth/management/sign-in
 * @group Авторизация (для управляющего сайта) - Функция для авторизации пользователя
 * @param {SignInDto.model} input.body.required Входные данные
 * @returns {AuthDto.model} 200 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.managementSignIn,
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Минимальная длина пароля должна быть 6 символов')
            .isLength({ min: 6 }),
        check('password', 'Максимальная длина пароля равна 30 символам')
            .isLength({ max: 30 })
    ],
    authManagementController.signIn
);

/**
 * Авторизация пользователя
 * @route POST /auth/management/logout
 * @group Авторизация (для управляющего сайта) - Функция для авторизации пользователя
 * @param {LogoutDto.model} input.body.required Входные данные
 * @returns {SuccessDto.model} 200 - Флаг, определяющий успех операции выхода пользователя из системы
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.managementLogout,
    [
        authMiddleware,
        check('type_auth', 'Некорректные данные для выхода из системы').isInt(),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    authManagementController.logout
);

/**
 * Выход пользователя из системы
 * @route POST /auth/activate
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {ActivationLinkDto.model} input.body.required Входные данные
 * @returns {SuccessDto.model} 200 - Флаг, определяющий успех операции подтверждения пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.activateLink,
    [
        check('activation_link', 'Некорректная ссылка активации').isUUID(4)
    ],
    authController.activate
);

/**
 * Обновление токена доступа
 * @route POST /auth/refresh/token
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {RefreshDto.model} input.body.required - Входные данные
 * @returns {AuthDto.model} 201 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.refreshToken,
    [
        check('refresh_token', 'Некорректные данные для обновления токена доступа').isString().isLength({ min: 1 })
    ],
    authController.refreshToken
);

/**
 * Верификация пользователя
 * @route POST /auth/verification
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @returns {FlagDto.model} 200 - Флаг, показывающий статус пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.verification,
    [
        authMiddleware,
    ],
    authController.verification
);

export default router;