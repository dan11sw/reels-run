/**
 * @typedef QuestDto
 * @property {string} task.required
 * @property {string} hint.required
 * @property {number} radius.required
 * @property {string} ref_media.required
 * @property {number} marks_id.required
 */
class QuestDto {
    task;
    hint;
    radius;
    ref_media;
    marks_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default QuestDto;