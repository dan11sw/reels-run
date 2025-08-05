
/**
 * @typedef CommandAddResultDto
 * @property {string} ref_media
 * @property {number} game_id
 */
class CommandAddResultDto {
    users_id;
    ref_media;
    game_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CommandAddResultDto;