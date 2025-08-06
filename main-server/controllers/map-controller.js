import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import securityService from "../services/security/security-service.js";
import AccessDto from "../dtos/security/access-dto.js";
import GeocoderValuesDto from "../dtos/geocoder/geocoder-values-dto.js";
import mapService from "../services/map/map-service.js";
import UsersIdDto from "../dtos/security/users-id-dto.js";
import MarkCreateDto from "../dtos/map/mark-create-dto.js";
import HttpCode from "../constants/http-code.js";
import MarkIdDto from "../dtos/map/mark-id-dto.js";

/* Контроллер карт */
class MapController {
    async markCreate(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkCreateDto(req.body);
            const data = await mapService.markCreate(body);

            return res.status(HttpCode.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markUpdateById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkCreateDto(req.body);
            const data = await mapService.markUpdateById(body);

            return res.status(HttpCode.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    async markDeleteById(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new MarkIdDto(req.body);
            const data = await mapService.markDeleteById(body);

            return res.status(HttpCode.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    async marks(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await mapService.marks(body);

            return res.status(HttpCode.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    async marksFree(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await mapService.marksFree(body);

            return res.status(HttpCode.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new MapController();