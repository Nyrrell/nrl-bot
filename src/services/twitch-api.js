import fetch from 'node-fetch';

const makePrependWord = (word) => (text) => word + text;

export function twitchAPI(clientId, oauth) {
    const baseURL = 'https://api.twitch.tv/helix';
    const opts = {
        headers: {
            'Client-ID': clientId,
            Authorization: 'Bearer ' + oauth,
        },
    }

    const prependWithUsers = makePrependWord('user_login=');
    const searchUsers = (users) => {
        users.forEach(user => user)
    }

    return {
        /** @see https://dev.twitch.tv/docs/api/reference#get-streams */
        getStream: (users) =>
            fetch(`${baseURL}/streams?${prependWithUsers(users)}`, opts)
                .then((res) => res.json())
                .then(({data, error, message}) => {
                    if (error) {
                        process.exitCode = 11;
                        throw new Error(`${error}: ${message}`);
                    }
                    return {
                        isLive: data.length > 0 && data[0].type === 'live',
                        ...data[0],
                    };
                }),
    };
}