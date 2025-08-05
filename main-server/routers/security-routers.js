import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import authManagementController from '../controllers/auth-management-controller.js';
import SecurityRoute from '../constants/routes/security.js';
import securityController from '../controllers/security-controller.js';
import AccessDto from '../dtos/security/access-dto.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import NameModules from '../constants/values/name-modules.js';
import AccessTokenDto from '../dtos/security/access-token-dto.js';
import UsersIdDto from '../dtos/security/users-id-dto.js';

const router = new Router();

/**
 * Проверка доступа пользователя к определённому функциональному модулю
 * @route POST /security/access
 * @group Безопасность - Функции для обеспечения безопасности API
 * @operationId securityAccess
 * @param {AccessDto.model} input.body.required Входные данные
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 * @security JWT
 */
router.post(
    SecurityRoute.access,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1}),
        check('name_module', 'Модуля с данным названием не существует').custom((value) => {
            let success = false;

            for(const val in NameModules){
                if(value === val){
                    success = true;
                    break;
                }
            }

            return success;
        })
    ],
    securityController.access
);

/**
 * Проверка валидности токена доступа
 * @route POST /security/token
 * @group Безопасность - Функции для обеспечения безопасности API
 * @operationId securityToken
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    SecurityRoute.token,
    securityController.token
);

/**
 * Проверка существования пользователя с текущим идентификатором
 * @route POST /security/user/exists
 * @group Безопасность - Функции для обеспечения безопасности API
 * @operationId securityUserExists
 * @returns {FlagDto.model} 200 - Флаг
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    SecurityRoute.userExists,
    securityController.userExists
);

export default router;