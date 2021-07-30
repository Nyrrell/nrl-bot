import dotenv from "dotenv";
dotenv.config()

export const prefix = '!'

let token
if (process.env.npm_lifecycle_event === 'dev') {
    token = process.env.DISCORD_TOKEN_DEV
} else {
    token = process.env.DISCORD_TOKEN_PROD
}

export { token };


