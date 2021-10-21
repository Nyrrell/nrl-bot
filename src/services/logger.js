import pino from "pino";
import { env } from "../config.js";


const target = [
  {
    target: 'pino-pretty', options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      colorize: true,
      ignore: 'pid,hostname'
    }
  }
]

env !== 'dev' && target.push({ target: 'pino/file', options: { destination: './share/logs' }})

const transport = pino.transport({ targets: target })


const logger = pino(transport);

export default logger;