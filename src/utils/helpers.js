import { promisify } from 'util';

export const wait = promisify(setTimeout)

export const checkUptime = (uptime) => {
    const diff = Math.floor((new Date() - new Date(uptime)) / 60000)
    return diff >= 30
}
