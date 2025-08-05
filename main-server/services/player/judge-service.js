import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import ApiError from '../../exceptions/api-error.js';
import db from '../../db/index.js';
import FlagDto from '../../dtos/response/flag-dto.js';
import "../../utils/array.js";

/* Сервис управления судъями */
class JudgeService {
    /**
     * Получение судьёй информации о выполненном квесте
     * @param {*} data Идентификатор судьи
     * @returns Информация о выполненном квесте
     */
    async judgeGetInfo(data) {
        try {
            const { users_id, info_games_id, commands_id } = data;

            const fixJudges = await db.FixJudges.findOne({
                where: {
                    users_id: users_id,
                    info_games_id: info_games_id,
                    commands_id: commands_id
                }
            });

            if (!fixJudges) {
                throw ApiError.BadRequest("Данный пользователь не состоит в списке судей");
            }

            const commandData = await db.Commands.findOne({
                where: {
                    id: commands_id
                }
            });

            commandData.dataValues.count_players = await db.DataPlayers.count({
                where: {
                    commands_id: commands_id
                }
            });

            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id
                }
            });

            infoGame.dataValues.count_points = await db.GamesQuests.count({
                where: {
                    info_games_id: info_games_id
                }
            });

            const registerCommands = await db.RegisterCommands.findOne({
                where: {
                    info_games_id: info_games_id,
                    commands_id: commands_id
                }
            });

            const games = await db.Games.findAll({
                where: {
                    commands_id: commands_id,
                    register_commands_id: registerCommands.id
                }
            });

            // Удаление всех игр, которые не были пройдены
            await games.removeIfAsync(async (item) => {
                const gameFinish = await db.FinishedGames.findOne({
                    where: {
                        game_id: item.id
                    }
                });

                item.dataValues.result_info = gameFinish;

                return (gameFinish) ? false : true;
            });

            for (let i = 0; i < games.length; i++) {
                const questInfo = await db.Quests.findOne({
                    where: {
                        id: games[i].dataValues.quests_id
                    }
                });

                games[i].dataValues.quest_info = questInfo;
            }

            return {
                results_info: games,
                info_game: infoGame,
                info_command: commandData
            }
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Добавление оценки выполнения игры
     * @param {*} data Информация об оценке
     * @returns Информация об оценке
     */
    async judgeSetScore(data) {
        const t = await db.sequelize.transaction();
        try {
            const { score, finished_games_id, fix_judges_id } = data;

            const judge = await db.FixJudges.findOne({
                where: {
                    id: fix_judges_id
                }
            });

            if (!judge) {
                throw ApiError.BadRequest("Пользователь с данным идентификатором не является судъей");
            }

            const isScoreExists = await db.JudgeScores.findOne({
                where: {
                    finished_games_id: finished_games_id,
                    fix_judges_id: fix_judges_id
                }
            });

            if (isScoreExists) {
                throw ApiError.BadRequest("Вы уже дали оценку данной игре");
            }

            await db.JudgeScores.create({
                finished_games_id: finished_games_id,
                score: score,
                fix_judges_id: fix_judges_id
            }, { transaction: t });

            await t.commit();
            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new JudgeService();