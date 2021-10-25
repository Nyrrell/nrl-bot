import { default as Keyv } from 'keyv'
import logger from "./logger.js";

const instagram = new Keyv('sqlite://share/db.sqlite', { namespace: 'instagram' });

instagram.on('error', err => logger.error(err));

export { instagram };