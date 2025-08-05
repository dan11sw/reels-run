/**
 * @typedef QuestsIdDto
 * @property {number} quests_id
 */
class QuestsIdDto{
    users_id;
    quests_id;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default QuestsIdDto;