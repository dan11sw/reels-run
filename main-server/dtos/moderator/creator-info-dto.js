import RoleDto from "../auth/role-dto.js";

/**
 * @typedef CreatorInfoDto
 * @property {number} id
 * @property {string} name
 * @property {string} surname
 * @property {string} nickname
 * @property {string} ref_image
 * @property {string} phone_num
 * @property {string} date_birthday
 * @property {string} location
 * @property {string} date_register
 * @property {string} created_at
 * @property {string} updated_at
 * @property {number} users_id
 * @property {string} email
 */
class CreatorInfoDto {
    id;
    name;
    surname;
    nickname;
    ref_image;
    phone_num;
    date_birthday;
    location;
    date_register;
    created_at;
    updated_at;
    users_id;
    modules;
    email;
    
    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CreatorInfoDto;