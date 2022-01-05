import { promisify } from 'util';
import { client } from '../app.js'
import { channelPrefix } from "../config.js";

export const wait = promisify(setTimeout);

/** @method 'minute, hour or day' */
export const diffDate = (input, method, diff) => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    switch (method) {
        case 'minute':
            method = minute;
            break;
        case 'hour':
            method = hour;
            break;
        case 'day':
            method = day;
            break;
    }
    return (Math.round((new Date() - new Date(input)) / method)) >= diff;
}

export const sortChannel = async (category) => {
    return await client.channels.cache.get(category)?.children.map(c => c.name.replace(channelPrefix, '')).sort();
}