/*--------------------------------------------------------
  Подключение к базе данных PostgreSQL.
  Общая точка входа всех моделей.
  -------------------------------------------------------- */

/* Конфигурация */
import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

/* Библиотеки */
import { Sequelize } from 'sequelize';
import config from 'config';

/* Mock */
import initMarks from './mock/marks/init-marks.js';
import initUsers from './mock/users/init-users.js';

/* Модели Sequelize */
import Activations from './models/Activations.js';
import AuthTypes from './models/AuthTypes.js';
import Bans from './models/Bans.js';
import CheckedGames from './models/CheckedGames.js';
import Commands from './models/Commands.js';
import CompleteGames from './models/CompleteGames.js';
import CoordPlayers from './models/CoordPlayers.js';
import CurrentGames from './models/CurrentGames.js';
import DataPlayers from './models/DataPlayers.js';
import DataUsers from './models/DataUsers.js';
import FinishedGames from './models/FinishedGames.js';
import FixJudges from './models/FixJudges.js';
import Games from './models/Games.js';
import GamesQuests from './models/GamesQuests.js';
import IdentificationMarks from './models/IdentificationMarks.js';
import InfoGames from './models/InfoGames.js';
import JudgeScores from './models/JudgeScores.js';
import Marks from './models/Marks.js';
import Quests from './models/Quests.js';
import QueueGames from './models/QueueGames.js';
import RegisterCommands from './models/RegisterCommands.js';
import TaskMarks from './models/TaskMarks.js';
import Tokens from './models/Tokens.js';
import Users from './models/Users.js';
import Roles from './models/Roles.js';
import UsersRoles from './models/UsersRoles.js';
import VideoShooters from './models/VideoShooters.js';
import Warnings from './models/Warnings.js';
import TestMarks from './models/TestMarks.js';
import initRoles from './default/roles/init-roles.js';
import ExecQuests from './models/ExecQuests.js';
import UsersGames from './models/UsersGames.js';
import QuestsResults from './models/QuestsResults.js';

// Глобальный объект для работы с Sequelize ORM
const db = {};

// Подключение к базе данных PostgreSQL
const sequelize = new Sequelize(
  config.get("database").database,
  config.get("database").user,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: config.get("database").host,
    port: config.get("database").port,
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    logging: false,
    pool: {
      max: 1000,
      min: 0,
      idle: 20000,
      acquire: 20000
    }
  },
);

// Добавление глобальному объекту всех моделей
db.Activations = Activations(sequelize, Sequelize.DataTypes);
db.AuthTypes = AuthTypes(sequelize, Sequelize.DataTypes);
db.Bans = Bans(sequelize, Sequelize.DataTypes);
db.CheckedGames = CheckedGames(sequelize, Sequelize.DataTypes);
db.Commands = Commands(sequelize, Sequelize.DataTypes);
db.CompleteGames = CompleteGames(sequelize, Sequelize.DataTypes);
db.CoordPlayers = CoordPlayers(sequelize, Sequelize.DataTypes);
db.CurrentGames = CurrentGames(sequelize, Sequelize.DataTypes);
db.DataPlayers = DataPlayers(sequelize, Sequelize.DataTypes);
db.DataUsers = DataUsers(sequelize, Sequelize.DataTypes);
db.FinishedGames = FinishedGames(sequelize, Sequelize.DataTypes);
db.FixJudges = FixJudges(sequelize, Sequelize.DataTypes);
db.Games = Games(sequelize, Sequelize.DataTypes);
db.GamesQuests = GamesQuests(sequelize, Sequelize.DataTypes);
db.IdentificationMarks = IdentificationMarks(sequelize, Sequelize.DataTypes);
db.InfoGames = InfoGames(sequelize, Sequelize.DataTypes);
db.JudgeScores = JudgeScores(sequelize, Sequelize.DataTypes);
db.Marks = Marks(sequelize, Sequelize.DataTypes);
db.Quests = Quests(sequelize, Sequelize.DataTypes);
db.QueueGames = QueueGames(sequelize, Sequelize.DataTypes);
db.RegisterCommands = RegisterCommands(sequelize, Sequelize.DataTypes);
db.TaskMarks = TaskMarks(sequelize, Sequelize.DataTypes);
db.Tokens = Tokens(sequelize, Sequelize.DataTypes);
db.Users = Users(sequelize, Sequelize.DataTypes);
db.Roles = Roles(sequelize, Sequelize.DataTypes);
db.UsersRoles = UsersRoles(sequelize, Sequelize.DataTypes);
db.VideoShooters = VideoShooters(sequelize, Sequelize.DataTypes);
db.Warnings = Warnings(sequelize, Sequelize.DataTypes);
db.TestMarks = TestMarks(sequelize, Sequelize.DataTypes);
db.UsersGames = UsersGames(sequelize, Sequelize.DataTypes);
db.ExecQuests = ExecQuests(sequelize, Sequelize.DataTypes);
db.QuestsResults = QuestsResults(sequelize, Sequelize.DataTypes);

// Установка взаимосвязей между моделями (таблицами базы данных)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Синхронизация моделей с базой данных
sequelize.sync().then(result => {
  /* Инициализация тестовыми данными */
  if (config.get("test.init_db")) {
    initRoles(db).then(() => {
      initMarks(db);
      initUsers(db);
    })
  }

  if (config.get('log.sequelize')) {
    console.log(result);
  }

  console.log("Синхронизация с базой данных: успешно");
}).catch(err => console.log(err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
