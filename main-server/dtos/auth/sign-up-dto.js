/**
 * @typedef SignUpDto
 * @property {string} email.required
 * @property {string} password.required
 * @property {string} nickname.required
 */
class SignUpDto {
    email;
    password;
    nickname;

    constructor(model) {
        this.email = model.email;
        this.password = model.password;
        this.nickname = model.nickname;
    }
}

export default SignUpDto;