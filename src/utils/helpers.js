import { promisify } from 'util';

export const wait = promisify(setTimeout)

export const twitchUptime = (uptime) => {
    const diff = Math.round((new Date() - new Date(uptime)) / 60000)
    return diff >= 30
}

export const diffDate = (date, unit, diff) => {
    const result = Math.round((new Date() - new Date(date)) / unit)
    return result >= diff
}
