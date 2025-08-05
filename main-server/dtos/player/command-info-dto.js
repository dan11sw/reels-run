
/**
 * @typedef CommandInfoDto
 * @property {number} id
 * @property {string} name
 * @property {string} date_register
 * @property {number} rating
 * @property {number} users_id
 * @property {number} count_players
 * @property {string} location
 * @property {string} created_at
 * @property {string} updated_at
 */
class CommandInfoDto {
    id;
    name;
    date_register;
    rating;
    created_at;
    updated_at;
    users_id;
    count_players;
    location;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CommandInfoDto;