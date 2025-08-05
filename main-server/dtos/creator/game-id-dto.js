import ContextInfoDto from "../base/context-info-dto.js";

/**
 * @typedef GameDeleteDto
 * @property {number} info_games_id - Идентификатор игры
 */
class GameIdDto extends ContextInfoDto {
    info_games_id;

    constructor(model) {
        super(model);
        
        this.info_games_id =  Number(model.info_games_id);
    }
}

export default GameIdDto;