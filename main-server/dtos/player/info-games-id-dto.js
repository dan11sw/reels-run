/**
 * @typedef InfoGamesIdDto
 * @property {number} info_games_id
 */
class InfoGamesIdDto{
    users_id;
    info_games_id;

    constructor(model){
        this.users_id = model.users_id;
        this.info_games_id = model.info_games_id;
    }
}

export default InfoGamesIdDto;