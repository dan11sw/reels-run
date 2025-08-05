/**
 * @typedef CommandsIdDto
 * @property {number} commands_id.required
 */
class CommandsIdDto{
    users_id;
    commands_id;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default CommandsIdDto;