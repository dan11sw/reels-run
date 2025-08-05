/**
 * @typedef RefreshDto
 * @property {string} refresh_token.required
 */
class RefreshDto {
    refresh_token;

    constructor(model) {
        this.refresh_token = model.refresh_token;
    }
}

export default RefreshDto;