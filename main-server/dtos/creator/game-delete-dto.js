
/**
 * @typedef GameDeleteDto
 * @property {number} info_games_id - Идентификатор игры
 */
class GameDeleteDto {
    users_id;
    info_games_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GameDeleteDto;