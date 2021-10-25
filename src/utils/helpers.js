import { promisify } from 'util';
import { client } from '../app.js'
import { channelPrefix } from "../config.js";

export const wait = promisify(setTimeout)

/** @method 'minute or day' */
export const diffDate = (input, method, diff) => {
    switch (method) {
        case 'minute':
            method = 60000
            break
        case 'day':
            method = 86400000
            break
    }
    return (Math.round((new Date() - new Date(input)) / method)) >= diff
}

export const sortChannel = async (category) => {
    return await client.channels.cache.get(category)?.children.map(c => c.name.replace(channelPrefix, '')).sort()
}
