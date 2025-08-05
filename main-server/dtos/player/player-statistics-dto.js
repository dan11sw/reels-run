/**
 * @typedef PlayerStatisticsDto
 * @property {number} rating_player
 * @property {number} rating_command
 */
class PlayerStatisticsDto {
    rating_player;
    rating_command;

    constructor(model){
        for(const key in model){
            this[key] = model[key];
        }
    }
}

export default PlayerStatisticsDto;