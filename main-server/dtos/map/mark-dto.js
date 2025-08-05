/**
* @typedef MarkDto
* @property {number} id
* @property {number} lat
* @property {number} lng
* @property {string} location
* @property {string} created_at
* @property {string} updated_at
* @property {number} users_id
*/
class MarkDto {
    id;
    title;
    description;
    lat;
    lng;
    location;
    created_at;
    updated_at;
    users_id;

    constructor(model) {
        this.id = model.id;
        this.title = model.title ?? "";
        this.description = model.description ?? "";
        this.lat = model.lat ?? 0.0;
        this.lng = model.lng ?? 0.0;
        this.location = model.location ?? "";
        this.created_at = model.created_at;
        this.updated_at = model.updated_at;
        this.users_id = model.users_id;
    }
}

export default MarkDto;