import RoleDto from "./role-dto.js";

/**
 * @typedef AuthDto
 * @property {string} access_token - Токен доступа
 * @property {string} refresh_token - Токен обновления
 * @property {number} type_auth - Тип авторизации пользователя
 * @property {RoleDto.model} roles - Разные роли пользователя
 */
class AuthDto {
    refresh_token
    access_token;
    type_auth;
    roles;

    constructor(model) {
        this.refresh_token = model.refresh_token;
        this.access_token = model.access_token;
        this.type_auth = model.type_auth;
        this.roles = model.roles;
    }
}

export default AuthDto;
