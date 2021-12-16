import KeyvSqlite from "@keyvhq/sqlite";
import Keyv from "@keyvhq/core";

import logger from "./logger.js";

const instagram = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'instagram' });
const primeGaming = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'prime' });
const youtubeKeyv = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'youtube' });

instagram.on('error', err => logger.error(err));
primeGaming.on('error', err => logger.error(err));
youtubeKeyv.on('error', err => logger.error(err));

export { instagram, primeGaming, youtubeKeyv };