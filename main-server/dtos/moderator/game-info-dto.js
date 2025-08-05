import QuestInfoDto from "./quest-info-dto.js";

/**
 * @typedef GameInfoDto
 * @property {number} id
 * @property {string} name
 * @property {number} max_count_commands
 * @property {string} date_begin
 * @property {string} date_end
 * @property {number} age_limit
 * @property {number} type
 * @property {number} rating
 * @property {number} min_score
 * @property {string} location
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} users_id
 * @property {Array.<QuestInfoDto>} quests
 * @property {number} status
*/
class GameInfoDto {
    id;
    name;
    max_count_commands;
    date_begin;
    date_end;
    age_limit;
    type;
    rating;
    min_score;
    location;
    created_at;
    updated_at;
    users_id;
    quests;
    status;
    users_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GameInfoDto;