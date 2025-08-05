/**
* @typedef GamesCheckedDto
* @property {number} id
* @property {string} name
* @property {string} date_begin
* @property {string} location
* @property {number} users_id
* @property {string} nickname
* @property {array} warnings
* @property {array} bans
* @property {boolean} accepted
*/
class GamesCheckedDto {
    id;
    name;
    date_begin;
    location;
    users_id;
    nickname;
    warnings;
    bans;
    accepted;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GamesCheckedDto;