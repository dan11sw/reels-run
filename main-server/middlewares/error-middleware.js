import ApiError from "../exceptions/api-error.js";
import logger from "../logger/logger.js";

/**
 * Middleware для обработки ошибок
 * @param {*} err Ошибка
 * @param {*} req Запрос пользователя
 * @param {*} res Ответ пользователю
 * @param {*} next 
 * @returns 
 */
const errorMiddleware = (err, req, res, next) => {
    logger.error({
        message: err.message,
    });

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }

    return res.status(500).json({
        message: err.message
    });
};

export default errorMiddleware;