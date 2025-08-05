import ContextInfoDto from "../base/context-info-dto.js";

/**
 * @typedef RemoveResultGameDto
 * @property {number} exec_quests_id.required
 */
class RemoveResultGameDto extends ContextInfoDto {
    session_id;
    exec_quests_id;

    constructor(model) {
        super(model);

        this.session_id = String(model.session_id || "");
        this.exec_quests_id = Number(model.exec_quests_id);
    }
}

export default RemoveResultGameDto;