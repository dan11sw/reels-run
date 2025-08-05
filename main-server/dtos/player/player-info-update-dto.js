/**
 * @typedef PlayerInfoUpdateDto
 * @property {string} email.required
 * @property {string} nickname.required
 */
class PlayerInfoUpdateDto{
    email;
    nickname;
    users_id;

    constructor(model){
        this.users_id = model.users_id;
        this.email = model.email;
        this.nickname = model.nickname;
    }
}

export default PlayerInfoUpdateDto;