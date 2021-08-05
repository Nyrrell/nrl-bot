import fetch from 'node-fetch';

const makePrependWord = (word) => (text) => word + text;

const generateOauth = () => {
    const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, } = process.env
    // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-client-credentials-flow
    fetch(`https://id.twitch.tv/oauth2/token?grant_type=client_credentials&client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => process.env.TWITCH_ACCESS_TOKEN = data['access_token'])
}

export function twitchAPI(clientId, oauth) {
    const baseURL = 'https://api.twitch.tv/helix';
    const opts = {
        headers: {
            'Client-ID': clientId,
            Authorization: 'Bearer ' + oauth,
        },
    }

    const prependWithUsers = makePrependWord('user_login=');

    return {
        /** @see https://dev.twitch.tv/docs/api/reference#get-streams */
        getStream: (users) =>
            fetch(`${baseURL}/streams?${prependWithUsers(users)}`, opts)
                .then((res) => res.json())
                .then(({data, error}) => {
                    if (error) {
                        try {
                            generateOauth()
                        }catch (e) {
                            console.error(e)
                        }
                    }
                    return {
                        isLive: data.length > 0 && data[0].type === 'live',
                        ...data[0],
                    };
                }),
    };
}