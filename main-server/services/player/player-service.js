import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import ApiError from '../../exceptions/api-error.js';
import db from '../../db/index.js';
import "../../utils/array.js";
import fs from 'fs';
import GameStatus from '../../constants/status/game-status.js';
import { v4 } from 'uuid';
import QuestStatus from '../../constants/status/quest-status.js';
import SetResultGameDto from '../../dtos/player/set-result-game-dto.js';
import ViewStatus from '../../constants/status/view-status.js';
import logger from '../../logger/logger.js';
import GameTypeResult from '../../constants/game-type-result.js';
import path from 'path';
import { syncDeleteFileByPath } from '../../utils/file-utils.js';
import RemoveResultGameDto from '../../dtos/player/remove-result-game-dto.js';
import { DateTime } from 'luxon';


/* Сервис управления картами */
class PlayerService {
    /**
     * Получение статуса пользователя в игре
     * @param {*} data Информация о пользователе
     * @returns Статус пользователя в игре
     */
    async gameStatus(data) {
        try {
            const { users_id } = data;

            const fixedJudges = await db.FixJudges.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (fixedJudges) {
                return {
                    judge: true,
                    player: false
                };
            }

            const dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!dataPlayers) {
                throw ApiError.NotFound("Информации о данном пользователе нет");
            }

            if (!dataPlayers.commands_id) {
                throw ApiError.BadRequest("Данный игрок не имеет команды");
            }

            const commands = await db.Commands.findOne({
                where: {
                    id: dataPlayers.commands_id
                }
            });

            const currentGames = await db.CurrentGames.findOne({
                where: {
                    commands_id: commands.id,
                }
            });

            if (!currentGames) {
                throw ApiError.BadRequest("У данного игрока нет текущей игры");
            }

            return {
                player: true,
                judge: false
            }
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение всех доступных игр
     * @param {*} data Информация о пользователе
     * @returns Список доступных игр
     */
    async games(data) {
        try {
            const { users_id } = data;

            const currentDate = new Date();
            const infoGames = await db.InfoGames.findAll({
                where: {
                    date_end: {
                        [db.Sequelize.Op.gt]: currentDate
                    }
                }
            });

            for (let i = 0; i < infoGames.length; i++) {
                // Определение числа команд, которые уже зарегистрированы на данную игру
                const countRegister = await db.RegisterCommands.count({ where: { info_games_id: infoGames[i].id } });
                infoGames[i].dataValues.count_register_commands = countRegister;

                // Определение никнеймов создателей игр
                const findingData = await db.DataUsers.findOne({ where: { users_id: infoGames[i].users_id } });
                infoGames[i].dataValues.nickname_creator = findingData.nickname;
            }

            return infoGames;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации о пользователе
     * @param {*} data Идентификатор пользователя
     * @returns Информация о пользователе
     */
    async playerInfo(data) {
        try {
            const { users_id, context_user_data } = data;

            const dataUser = await db.DataUsers.findOne({ where: { users_id: users_id } });
            dataUser.dataValues.data_players = (await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            }));

            dataUser.dataValues.email = context_user_data.email;

            return {
                ...dataUser.dataValues
            };
        } catch (e) {
            console.log(e);
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Обновление информации о пользователе
     * @param {*} data Информация о пользователе
     * @returns Информация о пользователе
     */
    async playerInfoUpdate(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, nickname } = data;
            const user = await db.Users.findOne({
                where: {
                    id: users_id
                }
            });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const userData = await db.DataUsers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!userData) {
                throw ApiError.NotFound("Данных у пользователя не существует!");
            }

            const userNickname = await db.DataUsers.findOne({ where: { nickname: nickname } });
            if (userNickname && (userNickname.users_id !== user.id)) {
                throw ApiError.BadRequest(`Пользователь с никнеймом ${nickname} уже существует`);
            }

            if (nickname !== userData.nickname) {
                await userData.update({
                    nickname: nickname
                }, { transaction: t });
            }

            await t.commit();

            return {
                users_id: users_id,
                nickname: nickname
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async playerInfoImgUpdate(filedata, data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id } = data;
            const dataUser = await db.DataUsers.findOne({
                where: {
                    users_id: users_id,
                }
            });

            if ((dataUser) && (dataUser.photo) && (dataUser.photo.length > 0)) {
                if (fs.existsSync(dataUser.photo)) {

                    // Удаление старого изображения
                    fs.unlinkSync(dataUser.photo);
                }
            }

            await db.DataUsers.update({ photo: filedata.path }, { where: { users_id: users_id }, transaction: t });

            await t.commit();

            return {
                url: `${config.get("url.api")}/${filedata.path}`
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async playerInfoImg(data) {
        try {
            const { users_id } = data;
            const dataUser = await db.DataUsers.findOne({
                where: {
                    users_id: users_id,
                }
            });

            if ((dataUser) && (dataUser.photo) && (dataUser.photo.length > 0)) {
                if (fs.existsSync(dataUser.photo)) {
                    return {
                        url: `${config.get("url.api")}/${dataUser.photo}`
                    };
                }
            }

            return {
                url: ''
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение статистики пользователя
     * @param {*} data Информация о пользователе
     * @returns Статистика пользователя
     */
    async playerStatistics(data) {
        try {
            const { users_id } = data;
            const dataPlayer = await db.DataPlayers.findOne({ where: { users_id: users_id } });
            let ratingCommand = 0;

            if (dataPlayer.commands_id) {
                const dataCommand = await db.Commands.findOne({ where: { id: dataPlayer.commands_id } });
                ratingCommand = dataCommand.rating;
            }

            const result = {
                rating_player: dataPlayer.rating,
                rating_command: ratingCommand
            };

            return result;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка определенных пользователей по тэгу
     * @param {*} data Тэг поиска
     * @returns Результат поиска
     */
    async playerFindCertain(data) {
        try {
            const { users_id, tag } = data;

            // Список всех свободных пользователей
            const freeAllPlayers = await db.DataPlayers.findAll({
                where: {
                    users_id: {
                        [db.Sequelize.Op.ne]: users_id
                    }
                }
            });

            const freePlayers = [];

            for (let i = 0; i < freeAllPlayers.length; i++) {
                const dplayer = await db.DataUsers.findOne({
                    where: {
                        users_id: freeAllPlayers[i].users_id,
                    }
                });

                if ((dplayer) && (
                    (dplayer.name.includes(tag))
                    || (dplayer.surname.includes(tag))
                    || (dplayer.nickname.includes(tag))
                )) {
                    freeAllPlayers[i].dataValues.data_player = undefined;
                    freeAllPlayers[i].dataValues.commands_id = undefined;
                    freePlayers.push(Object.assign(freeAllPlayers[i].dataValues, dplayer.dataValues))
                }
            }

            return freePlayers;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Присоединение игрока к конкретной игре
     * @param {*} data Данные запроса
     * @returns Результат связывания игрока с конкретной игрой
     */
    async playerJoinGame(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, info_games_id } = data;

            const usersGames = await db.UsersGames.findAll({
                where: {
                    users_id: users_id,
                    status: GameStatus.ACTIVE
                }
            });

            if (usersGames && usersGames.length > 0) {
                throw ApiError.BadRequest("Одновременно нельзя зарегистрироваться на несколько игр");
            }

            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id
                }
            });

            if (!infoGame) {
                throw ApiError.BadRequest("Данной игры не существует");
            }

            // Идентификатор сессии
            const sessionId = v4();

            // Создание связи между пользователем и игрой
            const createUserGame = await db.UsersGames.create({
                users_id: users_id,
                info_games_id: info_games_id,
                session_id: sessionId,
                status: GameStatus.ACTIVE
            }, { transaction: t });

            // Определение игровых квестов
            const quests = await db.GamesQuests.findAll({
                where: {
                    info_games_id: info_games_id
                }
            });

            let quest = null;

            if (quests.length > 0) {
                for (let i = 0; i < quests.length; i++) {
                    const item = quests[i];
                    const questItem = await db.Quests.findOne({
                        where: {
                            id: item.quests_id
                        }
                    });

                    if (i == 0 && questItem) {
                        quest = questItem;

                        await db.ExecQuests.create({
                            users_games_id: createUserGame.id,
                            quests_id: quest.id,
                            status: QuestStatus.ACTIVE
                        }, { transaction: t });
                    } else if (questItem) {
                        await db.ExecQuests.create({
                            users_games_id: createUserGame.id,
                            quests_id: questItem.id,
                            status: QuestStatus.NON_ACTIVE
                        }, { transaction: t });
                    }
                }
            } else {
                throw ApiError.BadRequest("У текущей игры отсутствуют квесты");
            }

            await t.commit();

            return {
                game: infoGame.dataValues,
                quest: quest.dataValues
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации об игре
     * @param {*} data Данные запроса
     * @returns Результат выполнения запроса
     */
    async playerGameInfo(data) {
        const t = await db.sequelize.transaction();

        // Формирование списка текущих квестов
        const findGameList = async () => {
            const data = await db.InfoGames.findAll({
                order: [['created_at', 'DESC']]
            });

            const games = [];

            // Обход данных всех найденных игр
            for (let i = 0; i < data.length; i++) {
                const itemI = data[i];

                const gamesQuests = await db.GamesQuests.findAll({
                    where: {
                        info_games_id: itemI.id
                    }
                });

                // Поиск квестов для текущей игры
                const quests = [];
                for (let j = 0; j < gamesQuests.length; j++) {
                    const itemJ = gamesQuests[j];

                    const quest = await db.Quests.findOne({
                        where: {
                            id: itemJ.quests_id
                        }
                    });

                    if (quest) {
                        quests.push({
                            ...quest.dataValues,
                            status: itemJ.status,
                            view: itemJ.view
                        });
                    }
                }

                games.push({
                    ...itemI.dataValues,
                    quests: quests
                });
            }

            return games;
        };

        try {
            const { users_id } = data;

            // Поиск записи регистрации игрока за определённой игрой
            const userGame = await db.UsersGames.findOne({
                where: {
                    users_id: users_id,
                    status: {
                        [db.Sequelize.Op.in]: [GameStatus.ACTIVE, GameStatus.COMPLETED]
                    }
                }
            });

            if (!userGame) {
                // Обработка ситуации, когда у пользователя нет текущей игры (значит нужно сформировать список доступных игр)
                const games = await findGameList();

                return {
                    joined_game: false,
                    games: games
                };
            }

            const game = await db.InfoGames.findOne({
                where: {
                    id: userGame.info_games_id
                }
            });

            if (!game) {
                // Удаляем зарегистрированную запись в таблице
                await userGame.destroy({ transaction: t });
                const games = await findGameList();

                await t.commit();

                return {
                    joined_game: false,
                    games: games
                };
            }

            const execQuests = await db.ExecQuests.findOne({
                where: {
                    users_games_id: userGame.id,
                    status: GameStatus.ACTIVE
                }
            });

            // Формирование информации о текущем квесте
            let quest = null;

            if (execQuests) {
                quest = await db.Quests.findOne({
                    where: {
                        id: execQuests.quests_id
                    }
                });
            }

            const result = {
                ...game.dataValues,
                session_id: userGame.session_id,
                status: userGame.status,
                quest: quest && quest.dataValues || null,
                joined_game: true
            };

            return result;
        } catch (e) {
            console.log(e);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Выход пользователя из игры
     * @param {*} data Данные запроса
     * @returns Результат выполнения запроса
     */
    async playerDetachGame(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, session_id } = data;

            const userGame = await db.UsersGames.findOne({
                where: {
                    users_id: users_id,
                    session_id: session_id
                }
            });

            if (!userGame) {
                throw ApiError.BadRequest(`Игровой сессии с идентификатором "${session_id}" не найдено`);
            }

            const execQuests = await db.ExecQuests.findAll({
                where: {
                    users_games_id: userGame.id
                }
            });

            // Отвязывание текущей игры и квестов от игрока
            for (let i = 0; i < execQuests.length; i++) {
                await execQuests[i].destroy({ transaction: t });
            }

            await userGame.destroy({ transaction: t });

            await t.commit();

            return {
                completed: true
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Ручное завершение пользователем конкретной игры
     * @param {*} data Данные запроса
     * @returns Результат выполнения запроса
     */
    async playerCompletedGame(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, session_id } = data;

            const userGame = await db.UsersGames.findOne({
                where: {
                    users_id: users_id,
                    session_id: session_id
                }
            });

            if (!userGame) {
                throw ApiError.BadRequest(`Игровой сессии с идентификатором "${session_id}" не найдено`);
            }

            if (userGame.dataValues.status !== GameStatus.COMPLETED) {
                throw ApiError.BadRequest(`Игровая сессия с идентификатором "${session_id}" не завершена`);
            }

            // Обновление состояния игры
            await userGame.update({
                status: GameStatus.FINISH
            }, { transaction: t });

            await t.commit();

            return {
                completed: true
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Добавление результата прохождения квеста
     * @param {*} file Путь к загруженному файлу
     * @param {SetResultGameDto} data Данные для добавления изображения к конкретной игре
     * @returns Ссылка на загруженное изображение
     */
    async playerSetResultGame(file, data) {
        if (!file || Object.keys(file).length == 0) {
            throw ApiError.BadRequest("Результирующий файл не был загружен на сервер");
        }

        const filepath = `${process.cwd()}${path.sep}${file.path}`;
        const t = await db.sequelize.transaction();

        try {
            const { users_id, exec_quests_id } = data;
            const execQuest = await db.ExecQuests.findOne({
                where: {
                    id: exec_quests_id
                }
            });

            if (!execQuest) {
                syncDeleteFileByPath(filepath);
                throw ApiError.NotFound("Игры, на которую планируется отчёт, не существует");
            }

            // Получение текущей игры пользователя, к которому будет прикреплён результат
            const userGame = await db.UsersGames.findOne({
                where: {
                    users_id: users_id,
                    status: GameStatus.ACTIVE,
                },
                include: {
                    model: db.ExecQuests,
                    where: {
                        id: exec_quests_id,
                        status: QuestStatus.ACTIVE,
                        view: ViewStatus.VISIBLE,
                        /*date_end: {
                            [db.Sequelize.Op.gte]: new Date()
                        }*/
                    }
                }
            });

            if (!userGame) {
                syncDeleteFileByPath(filepath);
                throw ApiError.NotFound("Игровая сессия, на которую планируется отчёт, не активна или не отображена на карте");
            }

            if ((userGame?.dataValues?.exec_quests?.length || 0) < 1) {
                syncDeleteFileByPath(filepath);
                throw ApiError.InternalServerError("Игровая сессия завершена некорректно (нет активных и видимых квестов)");
            }

            const questResult = await db.QuestsResults.findOne({
                where: {
                    exec_quests_id: exec_quests_id
                }
            });

            if (questResult) {
                syncDeleteFileByPath(filepath);
                throw ApiError.NotFound("Данная игровая сессия уже имеет прикреплённый результат");
            }

            const createResult = await db.QuestsResults.create({
                filepath: file.path,
                type: GameTypeResult.IMAGE,
                exec_quests_id: exec_quests_id
            }, { transaction: t });

            await execQuest.update({
                status: QuestStatus.FINISH
            }, { transaction: t });

            await t.commit();

            return {
                id: createResult.id
            };
        } catch (e) {
            // Delete file
            syncDeleteFileByPath(filepath);

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление информации о результате игры
     * @param {RemoveResultGameDto} data Данные для удаления информации о результате
     * @returns Идентификатор удалённой игры
     */
    async playerRemoveResultGame(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, exec_quests_id, session_id } = data;

            const currentGame = await db.UsersGames.findOne({
                where: {
                    users_id: users_id,
                    session_id: session_id,
                    status: GameStatus.ACTIVE
                },
                include: {
                    model: db.ExecQuests,
                    where: {
                        id: exec_quests_id,
                        status: QuestStatus.FINISH
                    },
                    include: {
                        model: db.QuestsResults,
                    }
                }
            });

            if (!currentGame) {
                throw ApiError.NotFound("Удаление результата прохождения квеста для данного квеста недоступно");
            }

            let filepath = "";
            let deletedId = -1;
            
            if (Array.isArray(currentGame?.dataValues?.exec_quests) && currentGame?.dataValues?.exec_quests.length == 1) {
                const execQuests = currentGame.dataValues.exec_quests;
                if (Array.isArray(execQuests[0]?.quests_results) && execQuests[0]?.quests_results.length == 1) {
                    const result = execQuests[0].quests_results[0].dataValues;

                    const questResult = await db.QuestsResults.findOne({
                        where: {
                            id: result.id
                        }
                    });

                    if (!questResult) {
                        throw ApiError.BadRequest("Информации о прохождении текущего квеста нет в базе данных (1)");
                    }

                    // Определение абсолютного пути до файла в текущей ОС
                    filepath = `${process.cwd()}${path.sep}${questResult.filepath}`;
                    deletedId = result.id;

                    await questResult.destroy({ transaction: t });
                }
            } else {
                throw ApiError.BadRequest("Информации о прохождении текущего квеста нет в базе данных (2)");
            }

            await t.commit();
            syncDeleteFileByPath(filepath);

            return {
                id: deletedId
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new PlayerService();