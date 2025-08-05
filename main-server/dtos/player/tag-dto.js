/**
 * @typedef TagDto
 * @property {string} tag
 */
class TagDto{
    users_id;
    tag;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default TagDto;