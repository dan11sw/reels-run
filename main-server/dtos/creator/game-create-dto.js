import QuestDto from "./quest-dto.js";
import ContextInfoDto from "../base/context-info-dto.js";

/**
 * @typedef GameCreateDto
 * @property {string} title.required
 * @property {string} location.required
 * @property {Array.<QuestDto>} quests.required
 */
class GameCreateDto extends ContextInfoDto {
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

export default GameCreateDto;