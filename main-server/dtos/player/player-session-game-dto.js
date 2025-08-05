/**
 * @typedef PlayerDetachGameDto
 * @property {number} users_id.required
 * @property {string} session_id.required
 */
class PlayerSessionGameDto {
    users_id;
    session_id;

    constructor(model) {
        this.users_id = model.users_id;
        this.session_id = model.session_id;
    }
}

export default PlayerSessionGameDto;