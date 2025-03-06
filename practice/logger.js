// const {createLogger, transports, format} = require("winston");
import { createLogger, transports, format } from "winston";

export const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`
        })
    ),
    transports: [
        new (transports.Console)(),
        new (transports.File)({ filename: 'somefile.log' })
    ]
});

//logger.info("Hello!");

// module.exports = {
//     logger
// }
