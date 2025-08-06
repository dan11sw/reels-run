/**
* @typedef MarkIdDto
* @property {number} id
* @property {number} lat
* @property {number} lng
* @property {string} location
* @property {string} created_at
* @property {string} updated_at
* @property {number} users_id
*/
class MarkIdDto {
    id;
    users_id;

    constructor(model) {
        this.id = model.id;
        this.users_id = model.users_id;
    }
}

export default MarkIdDto;