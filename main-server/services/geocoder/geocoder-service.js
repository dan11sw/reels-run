import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import ApiError from '../../exceptions/api-error.js';
import NodeGeocoder from 'node-geocoder';

/* Сервис системы безопасности */
class GeocoderService {
    /**
     * Конвертация координат (lat; lng) в строковый адрес
     * @param {*} data Данные для конвертации
     * @returns Полный адрес
     */
    async values(data) {
        try {
            const options = {
                provider: 'mapbox',
                apiKey: process.env.MAPBOX_API_KEY,
                language: "ru"
            };

            const geocoder = NodeGeocoder(options);

            const { lat, lng } = data;

            // Конвертирование координат в адрес
            const result = await geocoder.reverse({ lat: lat, lon: lng });

            return {
                address: result[0].formattedAddress
            }
        } catch (e) {
            console.log(e);
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new GeocoderService();