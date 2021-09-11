import _sequelize from 'sequelize';
const { Sequelize, DataTypes } = _sequelize;

import _streamers from "../models/streamers.js";
import _dailySub from "../models/dailySub.js";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false
});

export const streamer = _streamers.init(sequelize, DataTypes)
export const dailySub = _dailySub.init(sequelize, DataTypes)
//await dailySub.sync()

