/**
 * @typedef MarkCreateDto
 * @property {number} lat.required
 * @property {number} lng.required
 * @property {string} location.required
 */
class MarkCreateDto {
    id;
    users_id;
    title;
    description;
    lat;
    lng;
    location;

    constructor(model) {
        this.id = model.id ?? null;
        this.users_id = model.users_id;
        this.title = model.title ?? "";
        this.description = model.description ?? "";
        this.lat = model.lat ?? 0.0;
        this.lng = model.lng ?? 0.0;
        this.location = model.location ?? "";
    }
}

export default MarkCreateDto;