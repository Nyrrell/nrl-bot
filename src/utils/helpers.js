import { promisify } from 'util';

export const wait = promisify(setTimeout)

export const liveDateCompare = (newDate, oldDate) => {
    const diff = Math.floor((new Date(newDate) - new Date(oldDate)) / 3600000)
    return diff >= 4
}
