/**
 * @typedef GamesDto
* @property {number} id
* @property {string} name
* @property {number} max_count_commands
* @property {string} date_begin
* @property {string} date_end
* @property {number} age_limit
* @property {boolean} type
* @property {number} rating
* @property {number} min_score
* @property {string} location
* @property {string} created_at
* @property {string} updated_at
* @property {number} users_id
* @property {number} count_register_commands
* @property {string} nickname_creator
*/
class GamesDto {
    id;
    name;
    max_count_commands;
    date_begin;
    date_end;
    age_limit;
    type;
    rating;
    min_score;
    location;
    created_at;
    updated_at;
    users_id;
    count_register_commands;
    nickname_creator;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GamesDto;