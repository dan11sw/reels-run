import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import FlagDto from '../../dtos/response/flag-dto.js';
import tokenService from '../token/token-service.js';
import securityService from '../security/security-service.js';
import NameModules from '../../constants/values/name-modules.js';

/* Сервис для реализации функций модераторов */
class ModeratorService {
    /**
     * Получение списка игр в очереди
     * @param {*} data Данные для получения списка игр в очереди
     * @returns Данные игр
     */
    async queueGames(data) {
        try {
            const { users_id } = data;
            const candidat = await db.Users.findOne({ where: { id: users_id } });

            if (!candidat) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не существует");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const queueGames = await db.QueueGames.findAll({
                attributes: ["id", "info_games_id", "date"]
            });

            const infoGamesList = [];
            for (let i = 0; i < queueGames.length; i++) {
                const gameItem = {};
                const infoGame = await db.InfoGames.findOne({
                    where: {
                        id: queueGames[i].info_games_id
                    }
                });

                if ((infoGame) && ((new Date(infoGame.date_begin)) > (new Date()))) {
                    gameItem.id = infoGame.id;
                    gameItem.name = infoGame.name;
                    gameItem.date_begin = infoGame.date_begin;
                    gameItem.location = infoGame.location;

                    const dataUsers = await db.DataUsers.findOne({
                        where: {
                            users_id: infoGame.users_id
                        }
                    });

                    if (!dataUsers) {
                        continue;
                    }

                    gameItem.users_id = dataUsers.users_id;
                    gameItem.nickname = dataUsers.nickname;

                    infoGamesList.push(gameItem);
                }
            }

            return infoGamesList;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
    * Получение информации о создателе
    * @param {*} data Данные для получения информации о создателе
    * @returns Данные создателя
    */
    async creatorInfo(data) {
        try {
            const { users_id, creator_users_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const creator = await db.Users.findOne({ where: { id: creator_users_id } });
            const modulesCreator = await securityService.checkAccessModule(creator_users_id, "creator");

            if ((!user) || (!modulesCreator) || (!creator)) {
                throw ApiError.BadRequest("Данный пользователь не является создателем");
            }

            const dataUsers = await db.DataUsers.findOne({
                where: {
                    users_id: creator_users_id
                }
            });

            const modulesAll = {
                creator: await securityService.checkAccessModule(creator_users_id, "creator"),
                moderator: await securityService.checkAccessModule(creator_users_id, "moderator"),
                manager: await securityService.checkAccessModule(creator_users_id, "manager"),
                admin: await securityService.checkAccessModule(creator_users_id, "admin"),
                super_admin: await securityService.checkAccessModule(creator_users_id, "super_admin")
            };

            dataUsers.dataValues.modules = modulesAll;
            dataUsers.dataValues.email = creator.email;

            const games = await db.InfoGames.findAll({ where: { users_id: creator_users_id } });
            const games_created = [];

            for (let i = 0; i < games.length; i++) {
                const index = await db.QueueGames.findOne({ where: { info_games_id: games[i].dataValues.id } });
                const quests = await db.GamesQuests.findAll({ where: { info_games_id: games[i].dataValues.id } });
                games[i].dataValues.count_points = quests.length;

                if (index) {
                    games[i].dataValues.warnings = [];
                    games[i].dataValues.bans = [];
                    games[i].dataValues.accepted = false;
                } else {
                    const checkedGame = await db.CheckedGames.findOne({ where: { info_games_id: games[i].dataValues.id } });
                    if (checkedGame) {
                        const warnings = await db.Warnings.findAll({ where: { checked_games_id: checkedGame.id } });
                        const bans = await db.Bans.findAll({ where: { checked_games_id: checkedGame.id } });
                        games[i].dataValues.warnings = warnings;
                        games[i].dataValues.bans = bans;
                        games[i].dataValues.accepted = checkedGame.dataValues.accepted;
                    }
                }

                games_created.push(games[i].dataValues);
            }

            return {
                info_creator: dataUsers,
                info_games: games_created
            }
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации об игре
     * @param {*} data Данные для получения информации об игре
     * @returns Данные игры
     */
    async gameInfo(data) {
        try {
            const { users_id, info_games_id } = data;

            const candidat = await db.Users.findOne({ where: { id: users_id } });

            if (!candidat) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не существует");
            }

            const modules =
                (await securityService.checkAccessModule(users_id, "moderator"))
                || (await securityService.checkAccessModule(users_id, "creator"))
                || (await securityService.checkAccessModule(users_id, "admin"))
                || (await securityService.checkAccessModule(users_id, "super_admin"));

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const infoGames = await db.InfoGames.findOne({
                where: {
                    id: info_games_id
                }
            });

            if (!infoGames) {
                throw ApiError.NotFound("Данной игры нет в базе данных");
            }

            const gamesQuests = await db.GamesQuests.findAll({
                where: {
                    info_games_id: info_games_id
                }
            });

            const quests = [];
            for (let i = 0; i < gamesQuests.length; i++) {
                const quest = await db.Quests.findOne({
                    where: {
                        id: gamesQuests[i].quests_id
                    },

                    include: {
                        model: db.Marks,
                    }
                });

                if (quest) {
                    quest.dataValues.lat = quest.dataValues.mark.dataValues.lat;
                    quest.dataValues.lng = quest.dataValues.mark.dataValues.lng;
                    quest.dataValues.location = quest.dataValues.mark.dataValues.location;
                    quest.dataValues.mark = undefined;

                    quests.push(quest);
                }
            }

            infoGames.dataValues.quests = quests;

            // Определение статуса игры:
            // 0 - неопределённый статус
            // 1 - игра одобрена
            // 2 - выдано предупреждение игре (нужно что-то поправить)
            // 3 - игра забанена (нельзя в неё играть)

            if ((await db.QueueGames.findOne({
                where: {
                    info_games_id: infoGames.id
                }
            }))) {
                infoGames.dataValues.status = 0;
            } else {
                const checkedGames = await db.CheckedGames.findOne({
                    where: {
                        info_games_id: infoGames.id
                    }
                });

                if (!checkedGames) {
                    infoGames.dataValues.status = 0;
                } else if (!checkedGames.accepted) {
                    const bans = await db.Bans.findAll({
                        where: {
                            checked_games_id: checkedGames.id
                        }
                    });

                    const warnings = await db.Warnings.findAll({
                        where: {
                            checked_games_id: checkedGames.id
                        }
                    });

                    infoGames.dataValues.moderator = {
                        users_id: checkedGames.users_id,
                        nickname: (await db.DataUsers.findOne({
                            where: {
                                users_id: checkedGames.users_id
                            }
                        })).nickname
                    }

                    infoGames.dataValues.bans = bans;
                    infoGames.dataValues.warnings = warnings;

                    if (bans.length != 0) {
                        infoGames.dataValues.status = 3;
                    } else {
                        if (warnings.length != 0) {
                            infoGames.dataValues.status = 2;
                        } else {
                            infoGames.dataValues.status = 0;
                        }
                    }
                } else {
                    infoGames.dataValues.status = 1;
                }
            }

            return infoGames;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Одобрение игры из очереди проверки
     * @param {*} data Данные игры
     * @returns Данные игры
     */
    async gameAccepted(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, info_games_id } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id
                }
            });

            if(!infoGame){
                throw ApiError.NotFound("Игры с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const queue = await db.QueueGames.findOne({
                where: {
                    info_games_id: info_games_id
                }
            });

            // Если игра в очереди, то её необходимо оттуда убрать
            if (queue) {
                await queue.destroy({ transaction: t });
            }

            const checkedGames = await db.CheckedGames.findOne({
                where: {
                    users_id: users_id,
                    info_games_id: info_games_id
                }
            });

            if (checkedGames && checkedGames.accepted) {
                throw ApiError.BadRequest("Игра с данным идентификатором уже одобрена");
            }

            // Добавление метки "одобрено" на текущую игру
            if (checkedGames) {
                await checkedGames.update({
                    accepted: true
                }, { transaction: t });
            } else {
                await db.CheckedGames.create({
                    accepted: true,
                    users_id: users_id,
                    info_games_id: info_games_id
                }, { transaction: t });
            }

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
     * Получение списка проверенных игр
     * @param {*} data Данные пользователя
     * @returns Список проверенных игр пользователем
     */
    async gamesChecked(data) {
        try {
            const { users_id } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не существует");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const checkedGames = await db.CheckedGames.findAll({
                where: {
                    users_id: users_id
                }
            });

            const infoGamesList = [];
            for (let i = 0; i < checkedGames.length; i++) {
                const elementGame = {};
                const infoGame = await db.InfoGames.findOne({
                    where: {
                        id: checkedGames[i].info_games_id
                    }
                });

                if (infoGame) {
                    elementGame.id = infoGame.id;
                    elementGame.name = infoGame.name;
                    elementGame.date_begin = infoGame.date_begin;
                    elementGame.location = infoGame.location;

                    const dataUsers = await db.DataUsers.findOne({
                        where: {
                            users_id: infoGame.users_id
                        }
                    });

                    if (!dataUsers) {
                        continue;
                    }

                    elementGame.users_id = dataUsers.users_id;
                    elementGame.nickname = dataUsers.nickname;

                    elementGame.warnings = await db.Warnings.findAll({
                        where: {
                            checked_games_id: checkedGames[i].id
                        }
                    });

                    elementGame.bans = await db.Bans.findAll({
                        where: {
                            checked_games_id: checkedGames[i].id
                        }
                    });

                    elementGame.accepted = checkedGames[i].accepted;

                    infoGamesList.push(elementGame);
                }
            }

            return infoGamesList;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка создателей в системе
     * @param {*} data Данные пользователя
     * @returns Список создателей в системе
     */
    async creatorsList(data) {
        try {
            const { users_id } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            // Получение информации о создателе (без применения групповой политики)
            const userModules = await db.UsersModules.findAll({
                where: {
                    creator: true
                }
            });

            const dataUser = await db.DataUsers.findAll({
                where: {
                    users_id: {
                        [db.Sequelize.Op.in]: userModules.map((item) => item.users_id)
                    }
                }
            });

            const dataCreators = dataUser.map((item) => {
                return {
                    users_id: item.users_id,
                    age: Math.floor(((new Date() - new Date(item.date_birthday)) / 1000 / (60 * 60 * 24)) / 365.25),
                    ref_image: item.ref_image,
                    location: item.location,
                    name: item.name,
                    surname: item.surname,
                    nickname: item.nickname
                }
            });

            for (let i = 0; i < dataCreators.length; i++) {
                const value = await db.InfoGames.findAll({
                    where: {
                        users_id: dataCreators[i].users_id
                    }
                });

                dataCreators[i].count_games = (await db.CheckedGames.findAll({
                    where: {
                        info_games_id: {
                            [db.Sequelize.Op.in]: value.map((item) => item.id)
                        },
                        accepted: true
                    }
                })).length;
            }

            return dataCreators;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Установка предупреждения игре
     * @param {*} data Данные предупреждения
     * @returns Данные предупреждения
     */
    async gameWarning(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, info_games_id, reason } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const queue = await db.QueueGames.findOne({
                where: {
                    info_games_id: info_games_id
                }
            });

            // Если игра в очереди, то её необходимо оттуда убрать
            if (queue) {
                await queue.destroy({ transaction: t });
            }

            const checkedGames = await db.CheckedGames.findOne({
                where: {
                    users_id: users_id,
                    info_games_id: info_games_id
                }
            });

            // Добавление метки "не одобрено" на текущую игру
            let cGames = null;
            if (checkedGames) {
                cGames = await checkedGames.update({
                    accepted: false
                }, { transaction: t });
            } else {
                cGames = await db.CheckedGames.create({
                    accepted: false,
                    users_id: users_id,
                    info_games_id: info_games_id
                }, { transaction: t });
            }

            // Добавление предупреждения определённой игре
            await db.Warnings.create({
                checked_games_id: cGames.id,
                reason: reason
            }, { transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Установка бана игре
     * @param {*} data Данные бана
     * @returns Данные бана
     */
    async gameBan(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, info_games_id, reason } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const queue = await db.QueueGames.findOne({
                where: {
                    info_games_id: info_games_id
                }
            });

            // Если игра в очереди, то её необходимо оттуда убрать
            if (queue) {
                await queue.destroy({ transaction: t });
            }

            const checkedGames = await db.CheckedGames.findOne({
                where: {
                    users_id: users_id,
                    info_games_id: info_games_id
                }
            });

            // Добавление метки "не одобрено" на текущую игру
            let cGames = null;
            if (checkedGames) {
                cGames = await checkedGames.update({
                    accepted: false
                }, { transaction: t });
            } else {
                cGames = await db.CheckedGames.create({
                    accepted: false,
                    users_id: users_id,
                    info_games_id: info_games_id
                }, { transaction: t });
            }

            // Добавление бана определённой игре
            await db.Bans.create({
                checked_games_id: cGames.id,
                reason: reason
            }, { transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Разблокировка игры
     * @param {*} data Данные разблокировки
     * @returns Данные разблокировки
     */
    async gameUnban(data) {
        const t = await db.sequelize.transaction();
        try {
            const { users_id, info_games_id } = data;

            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.NotFound("Пользователя с данным идентификатором не найдено");
            }

            const modules = await securityService.checkAccessModule(users_id, "moderator");

            if (!modules) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const queue = await db.QueueGames.findOne({
                where: {
                    info_games_id: info_games_id
                }
            });

            // Если игра в очереди, то её необходимо оттуда убрать
            if (queue) {
                await queue.destroy({ transaction: t });
            }

            const checkedGames = await db.CheckedGames.findOne({
                where: {
                    users_id: users_id,
                    info_games_id: info_games_id
                }
            });

            // Добавление метки "не одобрено" на текущую игру
            let cGames = null;
            if (checkedGames) {
                cGames = await checkedGames.update({
                    accepted: false
                }, { transaction: t });
            } else {
                cGames = await db.CheckedGames.create({
                    accepted: false,
                    users_id: users_id,
                    info_games_id: info_games_id
                }, { transaction: t });
            }

            // Удаление всех банов для игры
            await db.Bans.destroy({
                where: {
                    checked_games_id: cGames.id
                }
            }, { transaction: t });

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new ModeratorService();