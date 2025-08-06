import winston, { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, align, printf } = format;
import fs, { stat } from "fs";
import { DateTime } from "luxon";
import os from "os";

import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

import config from "config";

import DailyRotateFile from "./daily-rotate-file/daily-rotate-file.js";
winston.transports.DailyRotateFile = DailyRotateFile;

const logFilepath = config.get("log").path || "./logs";
const maxSize = "100m";
const fullVersion = "1.0.0.0";
const treeName = "master";
const typeApp = "console";

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();

    for (const interfaceName in interfaces) {
        const iface = interfaces[interfaceName];
        for (const entry of iface) {
            if (entry.family === "IPv4" && !entry.internal) {
                return entry.address;
            }
        }
    }

    return "127.0.0.1";
};

const localIP = getLocalIP();

const createRotateTransport = (level, filename = "app") => {
    const writeLogHeader = (filename) => {
        const currentDate = DateTime.now();
        const logHeader =
            `/*
 * main-server/${fullVersion}-[${currentDate.toISODate()}] ${os.platform().toUpperCase()} (${os.release()}) @${treeName} <${typeApp}>
 * User@${os.hostname()} (${localIP})
 * ReelsRun (Основной сервер)
 */\n\n`;

        fs.appendFileSync(filename, logHeader, 'utf8', (err) => {
            if (err) {
                throw err;
            }
        });
    };

    const transport = new DailyRotateFile({
        level: level,
        filename: filename,
        dirname: `${logFilepath}\\%DATE%`,
        datePattern: 'YYYY-MM-DD',
        maxSize: maxSize,
        extension: '.log'
    }, writeLogHeader);

    return transport;
};

const sillyTransport = createRotateTransport("silly");

const logger = createLogger({
    format: combine(
        printf((info) => {
            const msg = `${DateTime.now().toFormat("HH:mm:ss.SSS")} [${info.level}]: ${info.message}`;
            console.log(msg);

            return msg;
        })
    ),
    transports: [
        sillyTransport,
        /*new (transports.File)({
            name: 'debug-file',
            filename: './logs/debug.log',
            level: 'debug',
            maxsize: 1024 * 1024 * 20,
        }),*/
        /*new (transports.File)({
            name: 'warn-file',
            filename: './logs/warn.log',
            level: 'warn'
        })*/
    ]
});

export function loggerDebug(message) {
    const level = "debug";

    if (message === undefined) {
        logger.log(level, "");

        return;
    }

    logger.log(level, message);
};

export function loggerError(message) {
    const level = "error";

    if (message === undefined) {
        logger.log(level, "");

        return;
    }

    logger.log(level, message);
};

export function loggerInfo(message) {
    const level = "info";

    if (message === undefined) {
        logger.log(level, "");

        return;
    }

    logger.log(level, message);
};

export default logger;