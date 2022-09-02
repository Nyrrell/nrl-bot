import _sequelize from 'sequelize';
const { Sequelize, DataTypes } = _sequelize;

import _streamers from "../models/streamers.js";
import _dailySub from "../models/dailySub.js";
import _youtube from "../models/youtube.js";
import _instagram from "../models/instagram.js";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './share/db.sqlite',
    logging: false
});

export const streamer = _streamers.init(sequelize, DataTypes);
export const dailySub = _dailySub.init(sequelize, DataTypes);
export const youtube = _youtube.init(sequelize, DataTypes);
export const instagram = _instagram.init(sequelize, DataTypes);

await streamer.sync();
await dailySub.sync();
await youtube.sync();
await instagram.sync();