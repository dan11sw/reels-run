import QuestDto from "./quest-dto.js";
import GameIdDto from "./game-id-dto.js";

/**
 * @typedef GameUpdateDto
 * @property {string} title.required
 * @property {string} location.required
 * @property {Array.<QuestDto>} quests.required
 */
class GameUpdateDto extends GameIdDto {
    title;
    location;
    quests;

    constructor(model) {
        super(model);

        this.title = String(model.title).trim();
        this.location = String(model.location).trim();
        this.quests = model.quests;
    }
}

export default GameUpdateDto;