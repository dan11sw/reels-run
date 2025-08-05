/**
 * @typedef AccessTokenDto
 * @property {string} access_token.required
 */
class AccessTokenDto {
    access_token;

    constructor(model){
        this.access_token = model.access_token;
    }
}

export default AccessTokenDto;