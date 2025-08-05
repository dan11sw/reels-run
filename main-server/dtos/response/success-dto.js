/**
 * @typedef SuccessDto
 * @property {boolean} success
 */
class SuccessDto {
    success;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default SuccessDto;