/**
 * @typedef CommandPlayersDto
 * @property {number} id - уникальный идентификатор пользователя
 * @property {string} name - имя пользователя
 * @property {string} surname - фамилия пользователя
 * @property {string} nickname - никнейм пользователя
 * @property {string} ref_image - ссылка на изображение пользователя
 * @property {string} phone_num - номер телефона пользователя
 * @property {string} date_birthday - дата рождения пользователя
 * @property {string} location - местоположение пользователя
 * @property {string} date_register - дата регистрации пользователя
 * @property {string} created_at - дата и время создания записи о пользователе
 * @property {string} updated_at - дата и время обновления записи о пользователе
 * @property {number} users_id - идентификатор пользователя, создавшего запись
 * @property {number} rating - рейтинг пользователя
 * @property {boolean} creator - является ли пользователь создателем записи 
*/
class CommandPlayersDto {
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
    creator;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CommandPlayersDto;