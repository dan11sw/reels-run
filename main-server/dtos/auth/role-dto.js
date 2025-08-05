/**
 * @typedef RoleDto
 * @property {number} id
 * @property {string} value
 * @property {number} priority
 */
class RoleDto {
    id;
    value;
    priority;

    constructor(model) {
        this.id = model.id;
        this.value = model.value;
        this.priority = model.priority;
    }
}

export default RoleDto;