import KeyvSqlite from "@keyvhq/sqlite";
import Keyv from "@keyvhq/core";

import logger from "./logger.js";

const instagramKeyv = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'instagram' });
const primeGamingKeyv = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'prime' });
const youtubeKeyv = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'youtube' });
const epicGameKeyv = new Keyv({ store: new KeyvSqlite({ uri: 'sqlite://share/db.sqlite' }), namespace: 'epic' });

primeGamingKeyv.on('error', err => logger.error(err));
instagramKeyv.on('error', err => logger.error(err));
epicGameKeyv.on('error', err => logger.error(err));
youtubeKeyv.on('error', err => logger.error(err));

export { instagramKeyv, primeGamingKeyv, youtubeKeyv, epicGameKeyv };