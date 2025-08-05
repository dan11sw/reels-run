/**
 * @typedef GameBanDto
 * @property {number} info_games_id.required
 * @property {string} reason.required
 */
class GameBanDto {
    users_id;
    info_games_id;
    reason;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GameBanDto;