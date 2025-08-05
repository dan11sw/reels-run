
/**
 * @typedef MarkDeleteInfoDto
 * @property {number} test_marks_id - Идентификатор метки
 */
class MarkDeleteInfoDto {
    users_id;
    test_marks_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default MarkDeleteInfoDto;