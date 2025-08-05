/**
 * @typedef GameWarningDto
 * @property {number} info_games_id.required
 * @property {string} reason.required
 */
class GameWarningDto {
    users_id;
    info_games_id;
    reason;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GameWarningDto;