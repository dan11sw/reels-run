import CreatorInfoDto from "./creator-info-dto.js";
import GamesCreatedDto from "../creator/games-created-dto.js";

/**
 * @typedef CreatorInfoRDto
 * @property {CreatorInfoDto.model} info_creator
 * @property {Array.<GamesCreatedDto>} info_games
 */
class CreatorInfoRDto {
    info_creator;
    info_games;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CreatorInfoRDto;