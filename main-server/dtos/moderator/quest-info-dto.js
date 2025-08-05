/**
 * @typedef QuestInfoDto
 * @property {number} id - уникальный идентификатор задания
 * @property {string} task - описание задания
 * @property {string} hint - подсказка к заданию
 * @property {string} ref_media - ссылка на дополнительный материал
 * @property {number} radius - радиус зоны выполнения задания
 * @property {string} created_at - дата и время создания задания
 * @property {string} updated_at - дата и время последнего обновления задания
 * @property {number} marks_id - идентификатор марки, к которой привязано задание
 * @property {number} lat - широта местоположения задания
 * @property {number} lng - долгота местоположения задания
 * @property {string} location - описание местоположения задания
 */
class QuestInfoDto {
    id;
    task;
    hint;
    ref_media;
    radius;
    created_at;
    updated_at;
    marks_id;
    lat;
    lng;
    location;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default QuestInfoDto;