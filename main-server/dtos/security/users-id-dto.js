/**
 * @typedef UsersIdDto
 * @property {number} users_id.required
 * @property {Object} context_user_data
 */
class UsersIdDto {
    users_id;
    context_user_data;

    constructor(model){
        this.users_id = model.users_id;
        this.context_user_data = model.context_user_data;
    }
}

export default UsersIdDto;