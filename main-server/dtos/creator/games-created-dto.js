/**
 * @typedef GamesCreatedDto
* @property {number} id.required - уникальный идентификатор (обязательное поле)
* @property {string} name.required - название игры (обязательное поле)
* @property {number} max_count_commands.required - максимальное количество команд в игре
* @property {string} date_begin.required - дата начала задания в формате ISO 8601
* @property {string} date_end.required - дата окончания задания в формате ISO 8601
* @property {number} age_limit.required - ограничение по возрасту
* @property {number} type.required - тип задания
* @property {number} rating.required - рейтинг задания
* @property {number} min_score.required - минимальный балл для прохождения задания 
* @property {string} location.required - местоположение задания
* @property {string} created_at.required - дата создания задания в формате ISO 8601
* @property {string} updated_at.required - дата последнего обновления задания в формате ISO 8601
* @property {number} count_points.required - количество баллов за прохождение задания
* @property {array} warnings - массив предупреждений
* @property {array} bans - массив запретов
* @property {boolean} accepted.required - флаг, указывающий на принятие задания
 */
class GamesCreatedDto {
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
    count_points;
    warnings;
    bans;
    accepted;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GamesCreatedDto;