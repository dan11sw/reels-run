import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import securityService from "../services/security/security-service.js";
import AccessDto from "../dtos/security/access-dto.js";
import AccessTokenDto from "../dtos/security/access-token-dto.js";
import UsersIdDto from "../dtos/security/users-id-dto.js";

/* Контроллер системы безопасности */
class SecurityController {
    async access(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new AccessDto(req.body);
            const data = await securityService.access(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async token(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new AccessTokenDto(req.body);
            const data = await securityService.token(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }

    async userExists(req, res, next){
        try{
            const errors = validationResult(req);

            if (!errors.isEmpty()){
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new UsersIdDto(req.body);
            const data = await securityService.userExists(body);

            return res.status(200).json(data);
        }catch(e){
            next(e);
        }
    }
}

export default new SecurityController();