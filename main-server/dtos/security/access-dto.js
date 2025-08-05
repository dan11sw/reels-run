/**
 * @typedef AccessDto
 * @property {string} name_module.required
 */
class AccessDto {
    users_id;
    name_module;

    constructor(model){
        this.users_id = model.users_id;
        this.name_module = model.name_module;
    }
}

export default AccessDto;