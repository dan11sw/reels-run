/**
 * @typedef ContextInfoDto
 * @property {number} users_id - Идентификатор пользователя
 * @property {number} type_auth - Тип авторизации
 * @property {*} context_user_data - Данные для контекста
 */
class ContextInfoDto {
    users_id;
    type_auth;
    context_user_data;

    constructor(model) {
        this.users_id = Number(model.users_id);
        this.type_auth = model.type_auth;
        this.context_user_data = model.context_user_data;
    }
}

export default ContextInfoDto;