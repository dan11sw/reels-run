/**
 * @typedef DataPlayersDto
 * @property {number} id
 * @property {number} rating
 * @property {number} commands_id
 * @property {number} users_id
 * @property {string} created_at
 * @property {string} updated_at
 */
class DataPlayersDto {
    id;
    rating;
    created_at;
    updated_at;
    commands_id;
    users_id;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default DataPlayersDto;