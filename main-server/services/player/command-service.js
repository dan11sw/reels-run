import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import ApiError from '../../exceptions/api-error.js';
import db from '../../db/index.js';
import FlagDto from '../../dtos/response/flag-dto.js';
import "../../utils/array.js";
import fs from 'fs';

/* Сервис управления командами */
class CommandService {
    /**
     * Получение информации о команде пользователя
     * @param {*} data Информация о пользователе
     * @returns Информация о команде пользователя
     */
    async command(data) {
        try {
            const { users_id, commands_id } = data;

            const dataCommand = await db.Commands.findOne({ where: { id: commands_id } });

            if (!dataCommand) {
                throw ApiError.BadRequest(`Команды с идентификатором ${commands_id} не существует`);
            }

            const countPlayers = (await db.DataPlayers.findAll({
                where: {
                    commands_id: dataCommand.id
                }
            })).length;

            const commandLocation = (await db.DataUsers.findOne({
                where: {
                    users_id: dataCommand.users_id
                }
            })).location;

            return {
                ...dataCommand.dataValues,
                count_players: countPlayers,
                location: commandLocation
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Обновление информации о пользователе
     * @param {*} data Информация о пользователе
     * @returns Информация о пользователе
     */
    async commandPlayers(data) {
        try {
            const { users_id, commands_id } = data;

            const dataCommand = await db.Commands.findOne({ where: { id: commands_id } });
            if (!dataCommand) {
                throw ApiError.NotFound("Команды с данным идентификатором не существует");
            }

            const dataUsersCommand = await db.DataPlayers.findAll();

            const usersCommand = [];
            dataUsersCommand.forEach((item) => {
                if (item.commands_id === dataCommand.id) {
                    usersCommand.push(item);
                }
            });

            // Получение персональных данных каждого игрока, который принадлежит данной команде
            const usersDataCommand = [];
            for (let i = 0; i < usersCommand.length; i++) {
                const value = await db.DataUsers.findOne({ where: { users_id: usersCommand[i].users_id } });
                let refImage = value.dataValues.ref_image;
                if (!refImage || !fs.existsSync(refImage)) {
                    refImage = null;
                }

                usersDataCommand.push({
                    ...value.dataValues,
                    rating: usersCommand[i].rating,
                    creator: (value.users_id === dataCommand.users_id),
                    ref_image: (refImage) ? `${config.get("url.api")}/${refImage}` : ''
                });
            }

            return usersDataCommand;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации о текущей игре, на которую зарегистрирована команда
     * @param {*} data Информация об игроке
     * @returns Информация о текущей игре, на которую зарегистрирована команда
     */
    async commandCurrentGame(data) {
        try {
            const { users_id, commands_id } = data;

            const dataCommand = await db.Commands.findOne({ where: { id: commands_id } });

            if (!dataCommand) {
                throw ApiError.NotFound("Команды с данным идентификатором не существует в базе данных");
            }

            const dataRegisterGames = await db.RegisterCommands.findAll({
                where: {
                    commands_id: dataCommand.id,
                },

                include: {
                    model: db.InfoGames,
                    where: {
                        id: {
                            [db.Sequelize.Op.eq]: db.Sequelize.col("register_commands.info_games_id")
                        },
                        date_end: {
                            [db.Sequelize.Op.gte]: new Date()
                        }
                    }
                }
            });

            // Отсеивание игр, которые были завершены командой
            await dataRegisterGames.removeIfAsync(async (item) => {
                const isCompleted = await db.CompleteGames.findOne({
                    where: {
                        info_games_id: item.info_games_id,
                        commands_id: item.commands_id
                    }
                });

                return (isCompleted) ? true : false;
            });

            // Отсутствие у команды текущих игр
            if (dataRegisterGames.length <= 0) {
                return null;
            }

            const currentGame = await db.InfoGames.findOne({
                where: {
                    id: dataRegisterGames[0].info_games_id
                }
            });

            currentGame.dataValues.count_quests = (await db.GamesQuests.findAll({
                where: {
                    info_games_id: currentGame.id
                }
            })).length;

            return {
                ...currentGame.dataValues
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации о всех играх, пройденных текущей командой
     * @param {*} data Информация об игроке и команде
     * @returns Информация о всех играх, пройденных текущей командой
     */
    async commandGames(data) {
        try {
            const { users_id, commands_id } = data;

            const dataCommand = await db.Commands.findOne({ where: { id: commands_id } });
            const completeGames = await db.CompleteGames.findAll({
                where: {
                    commands_id: dataCommand.id,
                    completed: true
                }
            });

            const infoGames = [];
            for (let i = 0; i < completeGames.length; i++) {
                const value = await db.InfoGames.findOne({
                    where: {
                        id: completeGames[i].info_games_id
                    }
                });

                if (value) {
                    value.dataValues.count_quests = (await db.GamesQuests.findAll({
                        where: {
                            info_games_id: value.id
                        }
                    })).length;

                    infoGames.push(value);
                }
            }

            return infoGames;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
    * Получение информации обо всех командах, зарегистрированных в системе
    * @param {*} data Информация об игроке и команде
    * @returns Информация о всех играх, пройденных текущей командой
    */
    async commandsList(data) {
        try {
            const { users_id } = data;

            const commands = await db.Commands.findAll();
            for (let i = 0; i < commands.length; i++) {
                commands[i].dataValues.count_players = (await db.DataPlayers.findAll({
                    where: {
                        commands_id: commands[i].id
                    }
                })).length;

                const commandLocation = (await db.DataUsers.findOne({
                    where: {
                        users_id: commands[i].users_id
                    }
                })).location;

                commands[i].dataValues.location = commandLocation;
            }

            return commands;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Присоединение пользователя к конкретной команде
     * @param {*} data Информация о пользователе и команде
     * @returns Флаг, характеризующий процесс присоединения
     */
    async commandJoin(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, commands_id } = data;

            // Получение информации о команде, в которую пользователь хочет войти
            const command = await db.Commands.findOne({
                where: {
                    id: commands_id
                }
            });
            if (!command) {
                throw ApiError.NotFound("Команды с данным идентификатором не существует");
            }

            // Проверка на существование команды у игрока
            const dataUser = await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            });
            if (dataUser.commands_id) {
                throw ApiError.NotFound("Чтобы перейти в другую команду нужно выйти из текущей");
            }

            // Получение информации о текущей игре команды
            const isCurrentGame = await db.CurrentGames.findOne({
                where: {
                    commands_id: commands_id
                }
            });
            if (isCurrentGame) {
                throw ApiError.BadRequest("Нельзя присоединится к команде, когда у неё есть текущая игра");
            }

            // Подсчитываем количество игроков в команде
            const countPlayers = (await db.DataPlayers.findAll({
                where: {
                    commands_id: commands_id
                }
            })).length;

            let dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!dataPlayers) {
                // Создаём данные для игрока
                dataPlayers = await db.DataPlayers.create({
                    rating: 0,
                    users_id: users_id,
                    commands_id: commands_id
                }, { transaction: t });
            } else {
                // Обновляем принадлежность игрока к команде
                await dataPlayers.update({
                    commands_id: commands_id
                }, { transaction: t });
            }

            // Если игроков в команде нет
            if (countPlayers === 0) {
                const currentCommand = await db.Commands.findOne({
                    where: {
                        id: commands_id
                    }
                });

                // То делаем создателем команды текущего игрока
                await currentCommand.update({
                    users_id: users_id
                }, { transaction: t });
            }

            await t.commit();

            return {
                commands_id: commands_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Выход пользователя из команды
     * @param {*} data Информация о пользователе и команде
     * @returns Флаг, характеризующий процесс присоединения
     */
    async commandDetach(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, commands_id } = data;

            const command = await db.Commands.findOne({
                where: {
                    id: commands_id
                }
            });

            if (!command) {
                throw ApiError.NotFound("Данной команды не существует");
            }

            const dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!dataPlayers) {
                await db.DataPlayers.create({
                    rating: 0,
                    users_id: users_id,
                    commands_id: null
                }, { transaction: t });
            } else if (dataPlayers.commands_id) {
                // Если текущий пользователь - создатель команды
                if (command.users_id === users_id) {
                    const lastPlayer = await db.DataPlayers.findOne({
                        where: {
                            commands_id: commands_id,
                            id: {
                                [db.Sequelize.Op.ne]: users_id
                            }
                        }
                    });

                    // то, передаём права создателя последнему игроку
                    if (lastPlayer && lastPlayer.users_id !== users_id) {
                        await command.update({
                            users_id: lastPlayer.users_id
                        }, { transaction: t });
                    } else {
                        // Если последнего игрока нет - удаляем информацию о команде
                        await db.Commands.destroy({
                            where: {
                                id: commands_id
                            }
                        }, { transaction: t });
                    }
                } else {
                    // Если текущий пользователь не создатель команды (удаляем игрока из команды)
                    await dataPlayers.update({
                        commands_id: null
                    }, { transaction: t });
                }
            }

            await t.commit();

            return {
                commands_id: commands_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Создание новой команды
     * @param {*} data Информация о команде
     * @returns Информация о команде
     */
    async commandCreate(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, name } = data;

            const command = await db.Commands.findOne({
                where: {
                    name: name
                }
            });

            if (command) {
                throw ApiError.BadRequest("Команда с данным названием уже существует");
            }

            const dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (dataPlayers.commands_id) {
                throw ApiError.BadRequest("Для создания команды необходимо выйти из уже существующей команды");
            }

            const commandInfo = await db.Commands.create({
                name: name,
                users_id: users_id,
                date_register: new Date(),
                rating: 0
            }, { transaction: t });

            await dataPlayers.update({
                commands_id: commandInfo.id
            }, { transaction: t });

            await t.commit();

            return {
                command_id: commandInfo.id,
                name: commandInfo.name
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Регистрация команды на игру
     * @param {*} data Информация о пользователе и игре
     * @returns Информация о пользователе и игре
     */
    async commandRegisterGame(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, info_games_id } = data;

            const command = await db.Commands.findOne({
                where: {
                    users_id: users_id
                },

                include: {
                    model: db.DataPlayers,
                    where: {
                        users_id: users_id,
                        commands_id: {
                            [db.Sequelize.Op.eq]: db.Sequelize.col("commands.id")
                        }
                    }
                }
            });

            if (!command) {
                throw ApiError.BadRequest("Для регистрации команды на игру необходимо быть создателем команды");
            }

            const countPlayers = await db.DataPlayers.count({
                where: {
                    commands_id: command.id
                }
            });

            /* if (countPlayers < 3) {
                throw ApiError.BadRequest("Для регистрации команды на игру необходимо чтобы в команде было не менее 3-х и не более 6-ти участников");
            } */

            // Проверка информации об игре
            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id,
                    date_begin: {
                        [db.Sequelize.Op.gte]: new Date()
                    }
                },

                include: {
                    model: db.CheckedGames,
                    where: {
                        info_games_id: info_games_id,
                        accepted: true
                    }
                }
            });

            if (!infoGame) {
                throw ApiError.BadRequest("Данная игра не доступна для регистрации");
            }

            // Поиск игры, на которую команда уже была зарегистрирована
            const registerGames = await db.RegisterCommands.findOne({
                where: {
                    commands_id: command.id,
                },

                include: {
                    model: db.InfoGames,
                    where: {
                        id: {
                            [db.Sequelize.Op.eq]: db.Sequelize.col('register_commands.info_games_id')
                        },
                        date_begin: {
                            [db.Sequelize.Op.gte]: new Date()
                        }
                    }
                }
            });

            const isCompletedGames = (registerGames) ? await db.CompleteGames.findOne({
                where: {
                    commands_id: registerGames.commands_id,
                    info_games_id: registerGames.info_games_id
                }
            }) : false;

            if (registerGames) {
                throw ApiError.BadRequest("Команда уже зарегистрирована на игру");
            }

            if (isCompletedGames) {
                throw ApiError.BadRequest("Команда уже проходила данную игру");
            }

            const currentGame = await db.CurrentGames.findOne({
                where: {
                    commands_id: command.id,
                    info_games_id: infoGame.id
                }
            });

            if (currentGame) {
                throw ApiError.BadRequest("Команда уже имеет текущую игру");
            }

            // Регистрация команды на игру
            await db.RegisterCommands.create({
                commands_id: command.id,
                info_games_id: info_games_id
            }, { transaction: t });

            await t.commit();

            return {
                info_games_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка доступных игр для команды
     * @param {*} data Информация о пользователе
     * @returns Список доступных игр для команды
     */
    async commandAvailableGames(data) {
        try {
            const { users_id } = data;

            // Все игры, которые удовлетворяют условию доступности в рамках игрового процесса
            const infoGames = await db.InfoGames.findAll({
                where: {
                    date_begin: {
                        [db.Sequelize.Op.gte]: new Date()
                    }
                },

                include: {
                    model: db.CheckedGames,
                    where: {
                        info_games_id: {
                            [db.Sequelize.Op.eq]: db.Sequelize.col('info_games.id')
                        },
                        accepted: true
                    }
                }
            });

            // Удаление игр, которые уже заполнены другими командами
            infoGames.removeIfAsync(async (item, idx) => {
                const countCommand = await db.RegisterCommands.count({
                    where: {
                        info_games_id: item.id
                    }
                });

                if (countCommand >= item.max_count_commands) {
                    return true;
                }

                return false;
            });

            for (let i = 0; i < infoGames.length; i++) {
                const countQuest = await db.GamesQuests.count({
                    where: {
                        info_games_id: infoGames[i].dataValues.id
                    }
                });

                infoGames[i].dataValues.count_quests = countQuest;
                infoGames[i].dataValues.checked_games = undefined;
            }

            return infoGames;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка свободных игроков по тэгу
     * @param {*} data 
     * @returns 
     */
    async commandFreeListTag(data) {
        try {
            const { users_id, tag } = data;

            // Список всех свободных пользователей
            const freeAllPlayers = await db.DataPlayers.findAll({
                where: {
                    commands_id: {
                        [db.Sequelize.Op.eq]: null
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
     * Приглашение игрока в команду
     * @param {*} data Данные игрока
     * @returns Данные игрока
     */
    async commandJoinCertain(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, player_users_id, commands_id } = data;

            const player = await db.Users.findOne({ where: { id: player_users_id } });

            if (!player) {
                throw ApiError.NotFound("Пользователя с данным идентификаторо не существует (приглашение в комманду)");
            }

            const command = await db.Commands.findOne({
                where: {
                    id: commands_id,
                    users_id: users_id
                }
            });

            if (!command) {
                throw ApiError.Forbidden("Только создатель команды может добавить игрока в команду");
            }

            const currentGame = await db.CurrentGames.findOne({
                where: {
                    commands_id: command.id
                }
            });

            if (currentGame) {
                throw ApiError.BadRequest("Нельзя добавить игрока в команду, когда началась игра");
            }

            const countDataPlayers = await db.DataPlayers.count({
                where: {
                    commands_id: command.id
                }
            });

            if (countDataPlayers >= 6) {
                throw ApiError.BadRequest("Нельзя добавить игроков в команду, состоящую из 6-ти игроков");
            }

            const dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: player_users_id,
                    commands_id: {
                        [db.Sequelize.Op.eq]: null
                    }
                }
            });

            if (!dataPlayers) {
                throw ApiError.BadRequest("Данный игрок уже состоит в команде");
            }

            // Обновление идентификатора команды у пользователя
            await dataPlayers.update({
                commands_id: command.id
            }, { transaction: t });

            await t.commit();

            return {
                player_users_id, commands_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Текущая видео инструкция
     * @param {*} data Идентификатор квеста
     * @returns Ссылка на видеоинструкцию
     */
    async commandCurrentMediaInstruction(data) {
        try {
            const { users_id, quests_id } = data;
            const quests = await db.Quests.findOne({
                where: {
                    id: quests_id
                }
            });

            if (!quests) {
                throw ApiError.NotFound("Квеста с данным идентификатором не существует");
            }

            return {
                ref_media: quests.ref_media
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Добавление результата выполнения игры
     * @param {*} data Информация о результате
     * @returns Информация о результате
     */
    async commandAddResult(data) {
        const t = await db.sequelize.transaction();
        try {
            const { ref_media, game_id, data_players_id } = data;
            const videoShooters = await db.VideoShooters.findOne({
                where: {
                    games_id: game_id,
                    data_players_id: data_players_id
                }
            });

            if (!videoShooters) {
                throw ApiError.BadRequest("Данный пользователь не зарегистрирован в системе как оператор");
            }

            // Удаление оператора
            await videoShooters.destroy({ transaction: t });

            // Добавление завершённой игры команды
            await db.FinishedGames.create({
                game_id: game_id,
                ref_image: ref_media
            }, { transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление команды
     * @param {*} data Информация о команде
     * @returns Информация о команде
     */
    async commandDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, commands_id } = data;

            const currentGame = await this.commandCurrentGame(data);
            if (Object.entries(currentGame).length != 0) {
                throw ApiError.BadRequest("Нельзя удалить команду, у которой есть текущая игра");
            }

            // Удаление команды
            await db.Commands.destroy({
                where: {
                    id: commands_id
                }
            }, { transaction: t });

            return commands_id;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new CommandService();