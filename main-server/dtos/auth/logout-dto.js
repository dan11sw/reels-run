/**
 * @typedef LogoutDto
 * @property {string} access_token.required
 * @property {string} refresh_token.required
 * @property {number} type_auth.required
 */
class LogoutDto {
    access_token;
    refresh_token;
    type_auth;

    constructor(model) {
        this.access_token = model.access_token;
        this.refresh_token = model.refresh_token;
        this.type_auth = model.type_auth;
    }
}

export default LogoutDto;