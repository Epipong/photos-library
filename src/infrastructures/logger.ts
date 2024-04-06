import { AxiosError } from "axios";
import winston, { createLogger, format } from "winston";
import { stringify } from "../services/utils/stringify";

const logger = createLogger({
  format: format.combine(format.colorize(), format.splat(), format.simple()),
  transports: [new winston.transports.Console()],
  level: process.env.NODE_ENV == "dev" ? "debug" : "info",
});

const logError = (error: Error) => {
  if (error instanceof AxiosError) {
    const code = (error as AxiosError).code;
    logger.error(
      `[${code}]\n${stringify((error as AxiosError).response?.data)}`,
    );
  }
  logger.error(`${error.message}`);
  logger.error(`${error.stack}`);
};

export { logger, logError };
