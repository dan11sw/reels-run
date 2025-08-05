
/**
 * @typedef MarkAddInfoDto
 * @property {number} title - Название метки
 * @property {number} description - Описание метки
 * @property {number} lat - Координата lat метки
 * @property {number} lng - Координата lng метки
 */
class MarkAddInfoDto {
    users_id;
    title;
    description;
    lat;
    lng;
    location;

    constructor(model) {
        this.users_id = model.users_id;
        this.title = model.title ?? "";
        this.description = model.description ?? "";
        this.lat = model.lat ?? 0.0;
        this.lng = model.lng ?? 0.0;
        this.location = model.location ?? "";
    }
}

export default MarkAddInfoDto;