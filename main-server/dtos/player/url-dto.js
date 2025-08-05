/**
 * @typedef UrlDto
 * @property {string} url
 */
class UrlDto {
    url

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default UrlDto;