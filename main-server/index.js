/* Импорты */
import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import express from "express";
import config from "config";
import logger, { loggerDebug } from "./logger/logger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import webApiConfig from "./config/web.api.json" with { type: "json" };
import "./utils/array.js";
import { AuthRouteBase } from './constants/routes/auth.js';
import { SecurityRouteBase } from './constants/routes/security.js';
import { ModeratorRouteBase } from './constants/routes/moderator.js';
import { CreatorRouteBase } from './constants/routes/creator.js';
import { GeocoderRouteBase } from './constants/routes/geocoder.js';
import { MapRouteBase } from './constants/routes/map.js';
import { PlayerRouteBase } from './constants/routes/player.js';
import PlayerRouter from './routers/player-routers.js';
import MapRouter from './routers/map-routers.js';
import GeocoderRouter from './routers/geocoder-routers.js';
import AuthRouter from './routers/auth-routers.js';
import SecurityRouter from './routers/security-routers.js';
import ModeratorRouter from './routers/moderator-routes.js';
import CreatorRouter from './routers/creator-routers.js';
import errorMiddleware from './middlewares/error-middleware.js';
import db from "./db/index.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import ExpressSwaggerGenerator from 'express-swagger-generator';
import swiggerOptions from './config/swagger.options.js';
import mathCircle from './math/circle.js';
import fs from 'fs';

/* Добавление поддержки require в ES Modules */
import { createRequire } from "module";
import jwtService from './services/token/jwt-service.js';
import tokenService from './services/token/token-service.js';
import GameStatus from './constants/status/game-status.js';
import ViewStatus from './constants/status/view-status.js';
import QuestStatus from './constants/status/quest-status.js';
import SocketEvents from './constants/socket-events.js';
import { DateTime } from 'luxon';
const require = createRequire(import.meta.url);
const socket = require('socket.io');

// Получение названия текущей директории
const __dirname = dirname(fileURLToPath(import.meta.url));
// Загрузка Swagger документации из каталога docs
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'docs.yaml'));

// Если нет директории public, то создаём её
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Инициализация экземпляра express-приложения
const app = express();
let server = null;

// Если разрешена демонстрация устаревшей версии Swagger
if (config.get("doc.swagger2") === true) {
    // то демонстрируем документацию помимо OpenAPI 3 версию документации Open API 2
    const expressSwaggerGenerator = ExpressSwaggerGenerator(express());
    expressSwaggerGenerator(swiggerOptions(__dirname));
}

// Add loggining all endpoints
if (Boolean(config.get("debug"))) {
    app.use((req, res, next) => {
        const startTime = DateTime.now();

        res.on('finish', () => {
            const duration = DateTime.now() - startTime;

            loggerDebug(JSON.stringify({
                method: req.method,
                url: req.url,
                status: res.statusCode,
                duration: `${duration}ms`,
                timestamp: DateTime.now().toFormat("HH:mm:ss.SSS"),
            }));
        });

        next();
    });
}

// Добавление в промежуточкое ПО раздачу статики из директории public
app.use('/public', express.static('public'));
// Добавление обработки запросов с JSON
app.use(express.json({ extended: true }));
// Добавление парсинка куки
app.use(cookieParser());
// Добавление вывода документации сервиса
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Настройка CORS-политик
app.use(cors({
    credentials: true,
    origin: webApiConfig['web_api'].map((value) => {
        return value;
    })
}));
// Связывание глобальных маршрутов с роутерами
app.use(AuthRouteBase, AuthRouter);
app.use(SecurityRouteBase, SecurityRouter);
app.use(CreatorRouteBase, CreatorRouter);
app.use(ModeratorRouteBase, ModeratorRouter);
app.use(GeocoderRouteBase, GeocoderRouter);
app.use(MapRouteBase, MapRouter);
app.use(PlayerRouteBase, PlayerRouter);
// Добавление промежуточного ПО для обработки ошибок
app.use(errorMiddleware);

let gameProcess = true;     // Игровой процесс (активация игрового процесса)
const PORT = config.get('port') || 5000;

let timerGlobal = null;
let lockGlobal = false;
let timerJudge = null;
let lockJudge = false;
let timerGame = null;
let lockGame = false;

/**
 * Запуск express-приложения (начало прослушивания по определённому порту)
 * @returns
 */
const handleStart = () => {
    try {
        // Начало прослушивания конкретного порта
        const serverHandle = app.listen(PORT, () => console.log(`Сервер запущен с портом ${PORT}`));
        logger.info({
            port: PORT,
            message: `Запуск сервера по порту ${PORT}.`
        });

        // Возвращение экземпляра
        return serverHandle;
    } catch (e) {
        logger.error({
            message: e.message
        });

        process.exit(1);
    }
}

server = handleStart();

const handleShutdown = () => {
    gameProcess = false;

    timerGlobal && clearTimeout(timerGlobal);
    timerJudge && clearTimeout(timerJudge);
    timerGame && clearTimeout(timerGame);

    timerGlobal = null;
    timerJudge = null;
    timerGame = null;

    server.close();

    console.log("Сервер остановлен");
}

process.on("SIGINT", () => {
    if (gameProcess) {
        handleShutdown();
        process.exit(0);
    }
});
process.on("SIGTERM", () => {
    if (gameProcess) {
        handleShutdown();
        process.exit(0);
    }
});
process.on("SIGHUP", () => {
    if (gameProcess) {
        handleShutdown();
        process.exit(0);
    }
});
process.on('exit', function () {
    if (gameProcess) {
        handleShutdown();
    }
});

/* Логика работы с Socket.IO */
const dataUsers = [];       // Глобальный объект, содержащий уникальные данные каждого пользователя (вместо БД)

/**
 * Проверка на существование пользователя по определённым данным элемента
 * @param {*} data Данные подключений
 * @param {*} element Данные элемента
 * @returns {number} Флаг, характеризующий существование подключения или его отсутствие 
 */
const duExistsUser = (data, element) => {
    if ((!element.users_id)
        || (!element.access_token)
        || (!element.socket_id)
        || (!Array.isArray(data))
    ) {
        return false;
    }

    for (let i = 0; i < data.length; i++) {
        if ((data[i].users_id === element.users_id)
            && (data[i].socket_id === element.socket_id)) {
            return true;
        }
    }

    return false;
}

/**
 * Проверка на существование пользователя по определённому идентификатору сокета
 * @param {*} data Данные подключений
 * @param {*} socket_id Идентификатор подключения по сокету
 * @returns {number} Идентификатор подключения
 */
const duExistsValueIndex = (data, socket_id) => {
    if (!Array.isArray(data)) {
        return (-1);
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].socket_id === socket_id) {
            return i;
        }
    }

    return (-1);
}

/**
 * Получение индекса из массива всех подключений по идентификатору пользователя
 * @param {*} data Данные всех подключений
 * @param {*} id Идентификатор пользователя
 * @returns {number} Идентификатор подключения
 */
const duGetIndexById = (data, id) => {
    if (!Array.isArray(data)) {
        return (-1);
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].users_id === id) {
            return i;
        }
    }

    return (-1);
}

/**
 * Функция задержки
 * @param {*} ms Время задержки в миллисекундах
 * @returns {Promise} Промис ожидания
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Генерация рандомного числа из диапазона [min; max]
 * @param {number} min Минимальное значение диапазона
 * @param {number} max Максимальное значение диапазона
 * @returns {number} Число из диапазона [min; max]
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Создание сервера Socket.IO
const io = socket(server);

/*
 * Правила добавления прослушивания определённых событий на сокеты:
 * 1) Уменьшить степень вложенности
 * 2) Каждая обработка должна быть максимально самостоятельна по 
 * отношению к базе данных. На практике было подтверждено то, что
 * когда на сервере или клиенте есть вложенные on, обрабатывающие
 * события, которые возникают часто, то это приводит к непоправимым
 * торможениям игрового процесса (исключение - глобальные объекты)
 */

// Обработка глобального события - "Подключение нового пользователя к серверу"
io.on("connection", (socket) => {

    loggerDebug(`Подключение сокета с ID = ${socket.id}`);

    // Обработка события - "Авторизация пользователя"
    socket.on(SocketEvents.AUTHENTICATION, async (data) => {
        try {
            // Аутентификация пользователя и занесение его в глобальный объект
            const dataEx = JSON.parse(data);

            const tokenValid = tokenService.checkAccessToken(dataEx.access_token);
            if (!tokenValid) {
                socket.emit("authentication_failed");
                return;
            }

            // Декодированные по токену данные о пользователе
            const usersData = jwtService.decode(dataEx.access_token);
            const findUser = await tokenService.findTokenByAccessToken(usersData.users_id, dataEx.access_token);

            if (!usersData.users_id || !findUser) {
                socket.emit("authentication_failed");
                return;
            }

            // Фактические (в БД) данные о пользователе
            const user = await db.Users.findOne({
                where: {
                    id: usersData.users_id
                }
            });

            if (!user) {
                socket.emit("authentication_failed");
                return;
            }

            // Если данный пользователь уже авторизован в системе
            if (duExistsUser(dataUsers, {
                socket_id: socket.id,
                users_id: usersData.users_id,
                access_token: dataEx.access_token
            })) {
                socket.emit("authentication_success");
                return;
            }

            // Иначе добавляем нового пользователя во временную БД (заменить на Redis)
            dataUsers.push({
                users_id: usersData.users_id,
                socket_id: socket.id,
                access_token: dataEx.access_token,
            });

            socket.emit("authentication_success");
        } catch (e) {
            console.log(e);
        }
    });

    // Обработка события - "Получение текущего статуса игрока"
    socket.on(SocketEvents.STATUS, async () => {
        const t = await db.sequelize.transaction();

        try {
            // Поиск пользователя из списка подключенных
            let index = duExistsValueIndex(dataUsers, socket.id);
            if (index < 0) {
                return;
            }

            const dataUser = dataUsers[index];

            // Поиск игры, на который в данный момент пользователь зарегистрирован
            const userGame = await db.UsersGames.findOne({
                where: {
                    users_id: dataUser.users_id,
                    status: {
                        [db.Sequelize.Op.in]: [GameStatus.ACTIVE, GameStatus.COMPLETED]
                    }
                }
            });

            if (!userGame) {
                socket.emit("status_off");
                return;
            } else if (userGame.status === GameStatus.COMPLETED) {
                socket.emit("status_completed");
                return;
            }

            const infoGame = await db.InfoGames.findOne({
                where: {
                    id: userGame.info_games_id
                }
            });

            if (!infoGame) {
                // Пользователь не зарегистрирован ни на одну игру
                socket.emit("status_off");
                return;
            }

            // Пользователь зарегистрирован на какую-то игру, теперь необходимо понять его текущий выполняемый квест
            const currentExecQuest = await db.ExecQuests.findOne({
                where: {
                    users_games_id: userGame.id,
                    status: GameStatus.ACTIVE
                }
            });

            if (!currentExecQuest) {
                // Игры нет, проверяем прошёл ли пользователь всю игру
                const finishedQuests = await db.ExecQuests.findAll({
                    where: {
                        users_games_id: userGame.id,
                        status: GameStatus.FINISH
                    }
                });

                if (finishedQuests.length == 0) {
                    // На всякий случай завершаем игру, для целостности данных в БД
                    await userGame.update({
                        status: GameStatus.FINISH
                    }, { transaction: t });

                    await t.commit();

                    socket.emit("status_off");
                    return;
                } else {
                    await userGame.update({
                        status: GameStatus.COMPLETED
                    }, { transaction: t });

                    await t.commit();

                    // Игра пройдена с вероятностью 90%
                    socket.emit("status_completed");
                    return;
                }
            }

            // Присутствует текущий квест, необходимо отправить статус с информацией о текущем квесте
            const currentQuest = await db.Quests.findOne({
                where: {
                    id: currentExecQuest.quests_id
                }
            });

            if (!currentQuest) {
                // Пользователь не зарегистрирован ни на одну игру
                await userGame.update({
                    status: GameStatus.FINISH
                }, { transaction: t });

                await t.commit();

                socket.emit("status_off");
                return;
            }

            const currentMark = await db.Marks.findOne({
                where: {
                    id: currentQuest.marks_id
                }
            });

            if (!currentMark) {
                // Пользователь не зарегистрирован ни на одну игру
                await userGame.update({
                    status: GameStatus.FINISH
                }, { transaction: t });

                await t.commit();

                socket.emit("status_off");
                return;
            }

            // Отправляем статус о текущем квесте
            socket.emit(
                "status_on",
                JSON.stringify({
                    ...currentQuest.dataValues,
                    mark: currentMark.dataValues,
                    status: currentExecQuest.status,
                    view: currentExecQuest.view,
                    users_games_id: userGame.id
                })
            );
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    });

    // Обработка события - "Текущий квест найден, необходимо его визуализировать"
    socket.on(SocketEvents.VIEW_CURRENT_QUEST, async (data) => {
        const t = await db.sequelize.transaction();

        try {
            // Поиск пользователя из списка подключенных
            let index = duExistsValueIndex(dataUsers, socket.id);
            if (index < 0) {
                return;
            }

            const dataUser = dataUsers[index];
            if (!dataUser.users_id) {
                return;
            }

            if (!data) {
                return;
            }

            const parseData = JSON.parse(data);
            const userGame = await db.UsersGames.findOne({
                where: {
                    id: parseData.users_games_id,
                    users_id: dataUser.users_id
                }
            });

            if (!userGame) {
                return;
            }

            const execQuest = await db.ExecQuests.findOne({
                where: {
                    users_games_id: userGame.id,
                    quests_id: parseData.id,
                    view: ViewStatus.INVISIBLE
                }
            });

            if (!execQuest) {
                return;
            }

            // Обновление данных в БД по текущему квесту
            await execQuest.update({
                view: ViewStatus.VISIBLE
            }, { transaction: t });

            await t.commit();

            // Изменяем полученные данные
            parseData.view = ViewStatus.VISIBLE;

            // Отправляем новый статус текущему пользователю
            socket.emit(
                "status_on",
                JSON.stringify(parseData)
            );
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    });

    // Обработка события - "Текущий игровой квест завершён"
    socket.on(SocketEvents.FINISHED_QUEST, async (data) => {
        const t = await db.sequelize.transaction();
        try {
            let index = duExistsValueIndex(dataUsers, socket.id);

            if (index < 0) {
                return;
            }

            const dataUser = dataUsers[index];
            if (!dataUser.users_id) {
                return;
            }

            const parseData = JSON.parse(data);
            const userGame = await db.UsersGames.findOne({
                where: {
                    id: parseData.users_games_id,
                    users_id: dataUser.users_id
                }
            });

            if (!userGame) {
                return;
            }

            const execQuest = await db.ExecQuests.findOne({
                where: {
                    users_games_id: userGame.id,
                    quests_id: parseData.id,
                    view: ViewStatus.VISIBLE // Нельзя завершить квест, который не виден пользователю
                }
            });

            if (!execQuest) {
                return;
            }

            // Обновление данных в БД по текущему квесту (квест завершён)
            await execQuest.update({
                status: QuestStatus.FINISH,
            }, { transaction: t });

            const nonActiveQuest = await db.ExecQuests.findOne({
                where: {
                    users_games_id: userGame.id,
                    status: QuestStatus.NON_ACTIVE
                }
            });

            // Формируем следующий квест на очередь
            if (nonActiveQuest) {
                await nonActiveQuest.update({
                    status: QuestStatus.ACTIVE,
                }, { transaction: t });
            }

            await t.commit();

            // Отправляем сообщение "Запусти процесс получения повторного состояния" (корневая функция игрового статуса)
            socket.emit("repeat_status_request");
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    });

    // Обработка события - "Запись текущих координат игрока в базу данных"
    socket.on(SocketEvents.SET_CURRENT_COORDINATES, async (data) => {
        const t = await db.sequelize.transaction();
        try {
            const location = JSON.parse(data);

            console.log("set_current_coordinates", data);

            let index = duExistsValueIndex(dataUsers, socket.id);

            if (index < 0) {
                return;
            }

            const user = dataUsers[index];
            if (!user.users_id) {
                return;
            }

            const coordPlayers = await db.CoordPlayers.findOne({
                where: {
                    users_id: user.users_id
                }
            });

            if (!coordPlayers) {
                await db.CoordPlayers.create({
                    users_id: user.userd_id,
                    lat: location.lat,
                    lng: location.lng
                }, { transaction: t });

                await t.commit();
                return;
            }

            await coordPlayers.update({
                lat: location.lat,
                lng: location.lng
            }, { transaction: t });

            await t.commit();
        } catch (e) {
            await t.rollback();
            console.log(e);
        }
    });

    // Обработка события - "Получение отдельным членом команды всех координат других пользователей"
    socket.on(SocketEvents.SET_PLAYER_COORDINATES, async (data) => {
        try {
            let index = duExistsValueIndex(dataUsers, socket.id);
            if (index < 0) {
                return;
            }

            const dataPlayers = await db.DataPlayers.findOne({
                where: {
                    users_id: dataUsers[index].users_id
                }
            });

            if ((!dataPlayers) || (!dataPlayers.commands_id)) {
                return;
            }

            socket.to(dataPlayers.commands_id).emit("add_player_coordinates", JSON.stringify({
                ...JSON.parse(data),
                users_id: dataPlayers.users_id
            }));
        } catch (e) {
            console.log(e);
        }
    });

    // Обработка события - "Отключения пользователя от текущего подключения"
    socket.on(SocketEvents.DISCONNECT, async () => {
        loggerDebug(`Отключение сокета с ID = ${socket.id}`);

        try {
            const index = duExistsValueIndex(dataUsers, socket.id);

            if (index >= 0) {
                dataUsers.splice(index, 1); // Удаление пользователя из глобального объекта
            }
        } catch (e) {
            console.log(e);
        }
    });
});
