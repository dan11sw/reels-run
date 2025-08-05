import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import securityService from "../services/security/security-service.js";
import AccessDto from "../dtos/security/access-dto.js";
import GeocoderValuesDto from "../dtos/geocoder/geocoder-values-dto.js";
import geocoderService from "../services/geocoder/geocoder-service.js";

/* Контроллер геокодера */
class GeocoderController {
    async values(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new GeocoderValuesDto(req.body);
            const data = await geocoderService.values(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }
}

export default new GeocoderController();