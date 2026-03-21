import pino from 'pino';
import { ENV } from './config';

const isDev = ENV.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, ignore: 'pid,hostname' },
    },
  }),
});
