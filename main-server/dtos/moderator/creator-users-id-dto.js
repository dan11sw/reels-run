/**
 * @typedef CreatorUsersIdDto
 * @property {number} creator_users_id;
 */
class CreatorUsersIdDto {
    users_id;
    creator_users_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CreatorUsersIdDto;