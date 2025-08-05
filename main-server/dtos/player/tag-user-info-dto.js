import DataPlayersDto from "./data-players-dto.js";

/**
 * @typedef TagUserInfoDto
 * @property {number} id - уникальный идентификатор пользователя
 * @property {string} name - имя пользователя
 * @property {string} surname - фамилия пользователя
 * @property {string} nickname - псевдоним пользователя
 * @property {string} ref_image - ссылка на изображение пользователя
 * @property {string} phone_num - номер телефона пользователя
 * @property {string} date_birthday - дата рождения пользователя
 * @property {string} location - местоположение пользователя
 * @property {string} date_register - дата регистрации пользователя
 * @property {number} users_id - идентификатор пользователей, к которому относится запись
 * @property {number} rating - рейтинг пользователя
 * @property {string} created_at - дата создания записи о пользователе
 * @property {string} updated_at - дата последнего обновления записи о пользователе
*/
class TagUserInfoDto {
    id;
    name;
    surname;
    nickname;
    ref_image;
    phone_num;
    date_birthday;
    location;
    date_register;
    created_at;
    updated_at;
    users_id;
    rating;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default TagUserInfoDto;