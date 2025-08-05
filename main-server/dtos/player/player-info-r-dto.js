/**
 * @typedef PlayerInfoRDto
 * @property {string} name
 * @property {string} surname
 * @property {string} nickname
 * @property {string} phone_num
 * @property {string} location
 * @property {string} date_birthday
 * @property {number} users_id
*/
class PlayerInfoRDto {
    name;
    surname;
    nickname;
    phone_num;
    location;
    date_birthday;
    users_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default PlayerInfoRDto;