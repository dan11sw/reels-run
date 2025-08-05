/**
 * @typedef GeocoderValuesDto
 * @property {number} lat.required
 * @property {number} lng.required
 */
class GeocoderValuesDto {
    users_id;
    lat;
    lng;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GeocoderValuesDto;