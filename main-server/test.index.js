import logger, { loggerDebug, loggerError, loggerInfo } from "./logger/logger.js";


for (let i = 0; i < 100; i++) {
    loggerInfo(`Hello, World! #${i}`);
    loggerDebug(`Hello, World! #${i}`);
    loggerError(`Hello, World! #${i}`);
    loggerInfo();
}

