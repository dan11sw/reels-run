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
import { checkRole } from '../../utils/check-role.js';
import fs from 'fs';
import GameIdDto from '../../dtos/creator/game-id-dto.js';
import GameUpdateDto from '../../dtos/creator/game-update-dto.js';
import GameCreateDto from '../../dtos/creator/game-create-dto.js';
import { isUndefinedOrNull } from '../../utils/objector.js';

/* Сервис системы безопасности */
class CreatorService {
    /**
     * Создание новой игры
     * @param {GameCreateDto} data Данные для создания новой игры
     * @returns Данные созданной игры
     */
    async gameCreate(data) {
        const t = await db.sequelize.transaction();

        try {
            const { location, title, quests, users_id } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const exists = await db.InfoGames.findOne({
                where: {
                    title: title.trim()
                }
            });

            if (exists) {
                throw ApiError.BadRequest("Игра с таким названием уже существует!");
            }

            // Создание новой игры
            const infoGame = await db.InfoGames.create({
                users_id: users_id,
                title: title,
                location: location
            }, { transaction: t });

            // Добавление новых квестов
            for (let i = 0; i < quests.length; i++) {
                const item = quests[i];

                // Создание нового квеста
                const quest = await db.Quests.create({
                    task: item.task,
                    hint: item.hint,
                    radius: item.radius,
                    action: item.action,
                    marks_id: item.marks_id,
                }, { transaction: t });

                if (quest) {
                    // Создание связки "игра - квест"
                    await db.GamesQuests.create({
                        quests_id: quest.dataValues.id,
                        info_games_id: infoGame.dataValues.id
                    }, { transaction: t });
                }
            }

            await t.commit();

            return data;
        } catch (e) {
            console.log(e);
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Изменение игры
     * @param {GameUpdateDto} data Данные для создания новой игры
     * @returns Данные созданной игры
     */
    async gameUpdate(data) {
        const t = await db.sequelize.transaction();

        try {
            const { location, title, quests, users_id, info_games_id } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id,
                    users_id: users_id
                }
            });

            if (!infoGame) {
                throw ApiError.BadRequest("Нет прав на изменение данной игры");
            }

            const infoGameTitle = await db.InfoGames.findOne({
                where: {
                    title: title
                }
            });

            if (infoGameTitle && (infoGameTitle.dataValues.id !== info_games_id)) {
                throw ApiError.BadRequest("Игра с таким наименованием уже существует");
            }

            // Квесты, которые нужно удалить
            let allConnectQuests = await db.GamesQuests.findAll({
                where: {
                    info_games_id: info_games_id
                }
            });

            allConnectQuests = allConnectQuests.flatMap((item) => item.quests_id);

            // Процедура удаления квестов
            for (let i = 0; i < allConnectQuests.length; i++) {
                const item = allConnectQuests[i];
                const quest = quests.findIndex((value) => {
                    return value.id == item;
                });

                if (quest < 0) {
                    const gameQuest = await db.GamesQuests.findOne({
                        where: {
                            info_games_id: info_games_id,
                            quests_id: item
                        }
                    });

                    if (gameQuest) {
                        // Удаление связки "игра - квест"
                        await gameQuest.destroy({ transaction: t });
                    }

                    const questDb = await db.Quests.findOne({
                        where: {
                            id: item
                        }
                    });

                    if (questDb) {
                        // Удаление квеста
                        await questDb.destroy({ transaction: t });
                    }
                }
            }

            // Квесты, которые нужно изменить
            const updateQuests = quests.filter((item) => {
                return !isUndefinedOrNull(item.id);
            });

            for (let i = 0; i < updateQuests.length; i++) {
                const item = updateQuests[i];
                const quest = await db.Quests.findOne({
                    where: {
                        id: item.id
                    }
                });

                if (quest) {
                    quest.task = item.task;
                    quest.hint = item.hint;
                    quest.radius = item.radius;
                    quest.action = item.action;

                    // Обновление данных квеста
                    await quest.save({ transaction: t });
                }
            }

            // Квесты, которые нужно добавить
            const createQuests = quests.filter((item) => {
                return isUndefinedOrNull(item.id);
            });

            // Процедура добавления новых квестов
            for (let i = 0; i < createQuests.length; i++) {
                const item = createQuests[i];

                const quest = await db.Quests.create({
                    task: item.task,
                    hint: item.hint,
                    radius: item.radius,
                    action: item.action,
                    marks_id: item.marks_id,
                }, { transaction: t });

                if (quest) {
                    // Создание связки "игра - квест"
                    await db.GamesQuests.create({
                        quests_id: quest.dataValues.id,
                        info_games_id: info_games_id
                    }, { transaction: t });
                }
            }

            infoGame.title = title;
            infoGame.location = location;
            infoGame.updated_at = new Date();

            // Сохранение данных об игре в транзакции
            await infoGame.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            console.log(e);
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации обо всех играх, которые были созданны текущим пользователем
     * @param {*} data Информация о пользователе
     * @returns Информация обо всех играх, созданных данным пользователем
     */
    async gamesCreated(data) {
        try {
            const { users_id, context_user_data } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            // Получение всех игр, которые были созданы данным пользователем
            let games = await db.InfoGames.findAll({
                where: {
                    users_id: users_id
                }
            });

            for (let i = 0; i < games.length; i++) {
                const item = games[i];
                let dateUpdate = new Date(item.updated_at);
                let dateStr = item.updated_at;

                const quests = await db.GamesQuests.findAll({
                    where: {
                        info_games_id: item.dataValues.id
                    }
                });

                for(let j = 0; j < quests.length; j++) {
                    const subItem = quests[j];
                    const questDb = await db.Quests.findOne({
                        where: {
                            id: subItem.quests_id
                        }
                    });

                    if(questDb) {
                        const subDateUpdate = new Date(questDb.updated_at);
                        if(dateUpdate < subDateUpdate) {
                            dateUpdate = subDateUpdate;
                            dateStr = questDb.updated_at;
                        }
                    }
                }

                games[i].dataValues.updated_at = dateStr;
                games[i].dataValues.count_quests = quests.length;
            }

            games = games.sort((a, b) => {
                const dateA = new Date(a.dataValues.updated_at);
                const dateB = new Date(b.dataValues.updated_at);

                if(dateA > dateB) {
                    return -1;
                } else if(dateA < dateB) {
                    return 1;
                }

                return 0;
            });

            return games;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации обо всех метках, созданных пользователем
     * @param {*} data Информация о пользователе
     * @returns Информация обо всех играх, созданных данным пользователем
     */
    async marksCreated(data) {
        try {
            const { users_id, context_user_data } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            // Получение всех меток, которые были созданы данным пользователем
            let marks = await db.Marks.findAll({
                where: {
                    users_id: users_id
                }
            });

            if(!marks) {
                return [];
            }

            marks = marks.sort((a, b) => {
                const dateA = new Date(a.dataValues.updated_at);
                const dateB = new Date(b.dataValues.updated_at);

                if(dateA > dateB) {
                    return -1;
                } else if(dateA < dateB) {
                    return 1;
                }

                return 0;
            });

            return marks;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление информации об игре
     * @param {*} data Данные для удаления игры
     * @returns Данные удалённой игры
     */
    async gameDelete(data) {
        const t = await db.sequelize.transaction();

        try {

            const { users_id, context_user_data, info_games_id } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const targetGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id,
                    users_id: users_id
                }
            });

            if (!targetGame) {
                throw ApiError.BadRequest("Удаляемой игры не обнаружено в базе данных");
            }

            const userForGameExist = await db.UsersGames.findOne({
                where: {
                    info_games_id: info_games_id
                }
            });

            if (userForGameExist) {
                throw ApiError.BadRequest("Данную игру удалить нельзя, поскольку в неё уже играют другие игроки.");
            }

            // Удаление информации обо всех квестах, привязанных к данной игре
            const questsGames = await db.GamesQuests.findAll({
                where: {
                    info_games_id: info_games_id
                }
            });

            for (let i = 0; i < questsGames.length; i++) {
                const dataQuest = questsGames[i];
                const quest = await db.Quests.findOne({
                    where: {
                        id: dataQuest.quests_id
                    }
                });

                // Удаление данных связки игра-квест
                await dataQuest.destroy({ transaction: t });

                if (quest) {
                    // Удаление информации о квесте
                    await quest.destroy({ transaction: t });
                }
            }

            // Удаление информации о определённой игре
            await targetGame.destroy({ transaction: t });
            await t.commit();

            return { info_games_id };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации об игре
     * @param {GameIdDto} data Данные для получения информации об игре
     * @returns 
     */
    async gameInfo(data) {
        try {
            const { users_id, context_user_data, info_games_id } = data;

            // Проверка доступа
            const check = await checkRole(users_id, 1);
            if (!check) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const targetGame = await db.InfoGames.findOne({
                where: {
                    id: info_games_id,
                    users_id: users_id
                }
            });

            if (!targetGame) {
                throw ApiError.BadRequest(`Игры с идентификатором ${info_games_id} не найдено`);
            }

            const questsGames = await db.GamesQuests.findAll({
                where: {
                    info_games_id: info_games_id
                }
            });

            const quests = [];
            for (let i = 0; i < questsGames.length; i++) {
                const questGame = questsGames[i];
                const quest = await db.Quests.findOne({
                    where: {
                        id: questGame.quests_id
                    }
                });

                if (quest) {
                    const mark = await db.Marks.findOne({
                        where: {
                            id: quest.marks_id
                        }
                    });

                    if (mark) {
                        quests.push({
                            ...quest.dataValues,
                            mark: mark.dataValues
                        });
                    }
                }
            }

            return {
                ...targetGame.dataValues,
                quests: quests
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Создание новой метки
     * @param {*} data Данные для создания новой метки
     * @returns Данные созданной метки
     */
    async markAddInfo(data) {
        const t = await db.sequelize.transaction();

        try {

            const { users_id, title, description, lat, lng } = data;

            // Создание новой метки
            const mark = await db.TestMarks.create({
                users_id: users_id,
                title: title,
                description: description,
                lat: lat,
                lng: lng
            }, { transaction: t });

            await t.commit();

            return {
                title, description, lat, lng,
                test_marks_id: mark.id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Добавление изображения к метке
     * @param {*} filedata Путь к загруженному файлу
     * @param {*} data Данные для добавления изображения к метке
     * @returns Ссылка на загруженное изображение
     */
    async markAddImg(filedata, data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, test_marks_id } = data;
            const mark = await db.TestMarks.findOne({
                where: {
                    id: test_marks_id,
                    users_id: users_id
                }
            });

            if (!mark) {
                fs.unlinkSync(filedata.path);
                throw ApiError.NotFound("Данной метки не существует");
            }

            if (mark.ref_img) {
                // Удаление старого изображения
                fs.unlinkSync(mark.ref_img);
            }

            await db.TestMarks.update({ ref_img: filedata.path }, { where: { id: test_marks_id }, transaction: t });

            await t.commit();

            return {
                test_marks_id,
                ref_img: `${config.get("url.api")}/${filedata.path}`
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление информации о метке
     * @param {*} data Данные для удаления метки
     * @returns Данные удалённой метки
     */
    async markDeleteInfo(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, test_marks_id } = data;
            const mark = await db.TestMarks.findOne({
                where: {
                    id: test_marks_id,
                    users_id: users_id
                }
            });

            if (!mark) {
                throw ApiError.NotFound("Данной метки не существует");
            }

            const filepath = mark.ref_img;
            // Удаление информации о метке

            await mark.destroy({ transaction: t });

            if (filepath) {
                // Удаление изображения
                fs.unlinkSync(filepath);
            }

            await t.commit();

            return {
                test_marks_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление изображения метки
     * @param {*} data Данные для удаления изображения метки
     * @returns Данные метки
     */
    async markDeleteImg(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, test_marks_id } = data;
            const mark = await db.TestMarks.findOne({
                where: {
                    id: test_marks_id,
                    users_id: users_id
                }
            });

            if (!mark) {
                throw ApiError.NotFound("Данной метки не существует");
            }

            const filepath = mark.ref_img;
            if (filepath) {
                // Удаление изображения
                fs.unlinkSync(filepath);
            }

            mark.ref_img = null;
            await mark.save({ transaction: t });

            await t.commit();

            return {
                test_marks_id
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new CreatorService();