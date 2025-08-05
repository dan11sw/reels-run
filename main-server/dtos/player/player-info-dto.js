import DataPlayersDto from "./data-players-dto.js";

/**
 * @typedef PlayerInfoDto
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
 * @property {DataPlayersDto.model} data_players - данные об игроках, связанных с пользователем
 * @property {string} email - адрес электронной почты пользователя
 * @property {string} created_at - дата создания записи о пользователе
 * @property {string} updated_at - дата последнего обновления записи о пользователе
*/
class PlayerInfoDto {
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
    data_players;
    email;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default PlayerInfoDto;