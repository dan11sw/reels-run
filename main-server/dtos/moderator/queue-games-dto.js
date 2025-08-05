/**
 * @typedef QueueGamesDto
 * @property {number} id
 * @property {string} name
 * @property {string} date_begin 
 * @property {string} location
 * @property {number} users_id
 * @property {string} nickname
 */
class QueueGamesDto {
    id;
    name;
    date_begin;
    location;
    users_id;
    nickname;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default QueueGamesDto;