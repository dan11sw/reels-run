/**
 * @typedef CommandCreateDto
 * @property {string} name
 */
class CommandCreateDto {
    users_id;
    name;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default CommandCreateDto;