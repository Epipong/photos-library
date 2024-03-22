import winston, { createLogger, format } from "winston";

export const logger = createLogger({
  format: format.combine(format.colorize(), format.splat(), format.simple()),
  transports: [new winston.transports.Console()],
});
