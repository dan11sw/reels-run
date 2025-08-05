/**
 * @typedef JudgeSetScoreDto
 * @property {number} score
 * @property {number} fix_judges_id
 * @property {number} finished_games_id
 */
class JudgeSetScoreDto {
    users_id;
    score;
    fix_judges_id;
    finished_games_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default JudgeSetScoreDto;