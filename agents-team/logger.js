import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, agent, ...meta }) => {
  const agentTag = agent ? `[${agent}]` : '';
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `${timestamp} ${level} ${agentTag} ${message}${metaStr}`;
});

export const createAgentLogger = (agentName) => createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  defaultMeta: { agent: agentName },
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `logs/${agentName.toLowerCase().replace(/\s+/g, '-')}.log`,
      format: combine(timestamp(), format.json()),
    }),
  ],
});
