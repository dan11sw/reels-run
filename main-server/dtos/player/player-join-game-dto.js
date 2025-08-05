/**
 * @typedef PlayerJoinGameDto
 * @property {number} users_id.required
 * @property {number} info_games_id.required
 */
class PlayerJoinGameDto {
    users_id;
    info_games_id;

    constructor(model) {
        this.users_id = model.users_id;
        this.info_games_id = model.info_games_id;
    }
}

export default PlayerJoinGameDto;