/**
 * @typedef CommandJoinCertainDto
 * @property {number} player_users_id
 * @property {number} commands_id
 */
class CommandJoinCertainDto {
    users_id;
    player_users_id;
    commands_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CommandJoinCertainDto;