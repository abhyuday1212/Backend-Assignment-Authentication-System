import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, colorize } = format;

// Custom format for file logging, used this resource for reference
// https://docs.chaicode.com/advance-node-logger/

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "../logs/app.log" }),
  ],
});

export default logger;
