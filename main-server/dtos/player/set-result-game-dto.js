import ContextInfoDto from "../base/context-info-dto.js";

/**
 * @typedef SetResultGameDto
 * @property {number} exec_quests_id.required
 */
class SetResultGameDto extends ContextInfoDto {
    exec_quests_id;

    constructor(model) {
        super(model);

        this.exec_quests_id = Number(model.exec_quests_id);
    }
}

export default SetResultGameDto;