import winston from 'winston';

const { combine, timestamp, colorize, printf, json } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
    })
);

const prodFormat = combine(timestamp(), json());

const logger = winston.createLogger({
    level: isDev ? 'debug' : 'info',
    format: isDev ? devFormat : prodFormat,
    transports: [
        new winston.transports.Console(),
        ...(isDev
            ? []
            : [
                  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                  new winston.transports.File({ filename: 'logs/combined.log' }),
              ]),
    ],
});

export default logger;
