/**
 * @typedef InfoGamesIdDto
 * @property {number} info_games_id;
 */
class InfoGamesIdDto {
    users_id;
    info_games_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default InfoGamesIdDto;