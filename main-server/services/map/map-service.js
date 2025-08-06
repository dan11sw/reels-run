import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import ApiError from '../../exceptions/api-error.js';
import db from '../../db/index.js';
import { isUndefinedOrNull } from '../../utils/objector.js';
import MarkIdDto from '../../dtos/map/mark-id-dto.js';
import MarkCreateDto from '../../dtos/map/mark-create-dto.js';
import GameStatus from '../../constants/status/game-status.js';

/* Сервис управления картами */
class MapService {
    /**
     * Создание новой метки
     * @param {*} data Информация для создания метки
     * @returns Созданная метка
     */
    async markCreate(data) {
        const t = await db.sequelize.transaction();

        try {
            const { title, description, lat, lng, location, users_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.BadRequest("Попытка удаления заданий неавторизованным пользователем");
            }

            // Поиск прав доступа для создания метки
            const userRoles = await db.UsersRoles.findAll({
                where: {
                    users_id: users_id
                },
                include: {
                    model: db.Roles,
                    where: {
                        priority: { [db.Sequelize.Op.gt]: 1 }
                    },
                },
            });

            if (userRoles.length === 0) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const mark = await db.Marks.findOne({
                where: {
                    lat: lat,
                    lng: lng
                }
            });

            if (mark) {
                throw ApiError.BadRequest(`Метка с координатами (${lat}; ${lng}) уже существует!`);
            }

            const newMark = await db.Marks.create({
                title: title,
                description: description,
                lat: lat,
                lng: lng,
                location: location,
                users_id: users_id
            }, { transaction: t });

            await t.commit();

            return new MarkCreateDto(newMark.dataValues);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Обновление метки по её идентификатору
     * @param {*} data Информация для обновления метки
     * @returns Обновлённая метка
     */
    async markUpdateById(data) {
        const t = await db.sequelize.transaction();

        try {
            const { id, title, description, lat, lng, location, users_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.BadRequest("Попытка обновления метки неавторизованным пользователем");
            }

            // Поиск прав доступа для создания метки
            const userRoles = await db.UsersRoles.findAll({
                where: {
                    users_id: users_id
                },
                include: {
                    model: db.Roles,
                    where: {
                        priority: { [db.Sequelize.Op.gt]: 1 }
                    },
                },
            });

            if (userRoles.length === 0) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const mark = await db.Marks.findOne({
                where: {
                    id: id
                }
            });

            if (!mark) {
                throw ApiError.BadRequest(`Метки с идентификатором ${id} не найдено.`);
            }

            const markUnique = await db.Marks.findOne({
                where: {
                    lat: lat,
                    lng: lng
                }
            });

            if (markUnique && (markUnique.id !== id)) {
                throw ApiError.BadRequest(`Метка с координатами (${lat}; ${lng}) уже существует!`);
            }

            mark.title = title;
            mark.description = description;
            mark.lat = lat;
            mark.lng = lng;
            mark.location = location;

            await mark.save({ transaction: t });
            await t.commit();

            return new MarkCreateDto(mark.dataValues);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Удаление метки по её идентификатору
     * @param {MarkIdDto} data Информация для удаления метки
     * @returns Удалённая
     */
    async markDeleteById(data) {
        const t = await db.sequelize.transaction();

        try {
            const { id, users_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.BadRequest("Попытка удаления метки неавторизованным пользователем");
            }

            // Поиск прав доступа для создания метки
            const userRoles = await db.UsersRoles.findAll({
                where: {
                    users_id: users_id
                },
                include: {
                    model: db.Roles,
                    where: {
                        priority: { [db.Sequelize.Op.gt]: 1 }
                    },
                },
            });

            if (userRoles.length === 0) {
                throw ApiError.Forbidden("Нет доступа");
            }

            const mark = await db.Marks.findOne({
                where: {
                    id: id
                }
            });

            if (!mark) {
                throw ApiError.BadRequest(`Метки с идентификатором ${id} не найдено.`);
            }

            let execQuests = await db.ExecQuests.findAll({
                where: {
                    status: GameStatus.ACTIVE
                },
                include: {
                    model: db.Quests,
                    include: {
                        model: db.Marks,
                        where: {
                            id: id
                        }
                    }
                },
            });

            execQuests = execQuests.filter((value) => {
                if(isUndefinedOrNull(value?.quest) || isUndefinedOrNull(value?.quest?.mark)) {
                    return false; 
                }

                return true;
            });

            if (!isUndefinedOrNull(execQuests) && execQuests.length > 0) {
                throw ApiError.BadRequest(`Метка с идентификатором ${id} используется в ${execQuests.length} активных игровых сессиях.`);
            }

            // Удаление метки
            await mark.destroy({ transaction: t });

            // фиксация изменений
            await t.commit();

            return new MarkCreateDto(mark.dataValues);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение метки по идентификатору
     * @param {*} data Данные пользователя
     * @returns Список меток
     */
    async markById(data) {
        try {
            const { users_id, marks_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.BadRequest("Попытка получения информации о метке не авторизованным пользователем");
            }

            const value = await db.Marks.findOne({
                where: {
                    id: marks_id
                }
            });

            return value;
        } catch (e) {
            console.log(e);
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка меток
     * @param {*} data Данные пользователя
     * @returns Список меток
     */
    async marks(data) {
        try {
            const { users_id } = data;
            const user = await db.Users.findOne({ where: { id: users_id } });

            if (!user) {
                throw ApiError.BadRequest("Попытка получения списка меток не авторизованным пользователем");
            }

            const values = await db.Marks.findAll();

            return values;
        } catch (e) {
            console.log(e);
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение свободных меток
     * @param {*} data Информация о пользователе
     * @returns Список свободных меток
     */
    async marksFree(data) {
        try {
            const { users_id } = data;

            const freeMarks = await db.Marks.findAll();

            return freeMarks;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new MapService();