
/**
 * @typedef JudgeGetInfoDto
 * @property {number} info_games_id
 * @property {number} commands_id
 */
class JudgeGetInfoDto {
    users_id;
    info_games_id;
    commands_id;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default JudgeGetInfoDto;