/**
 * @typedef GeocoderAddressDto
 * @property {number} address.required
 */
class GeocoderAddressDto {
    users_id;
    address;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default GeocoderAddressDto;