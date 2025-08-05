/**
 * @typedef GameUnbanDto
 * @property {number} info_games_id.required
 */
class GameUnbanDto {
    users_id;
    info_games_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GameUnbanDto;