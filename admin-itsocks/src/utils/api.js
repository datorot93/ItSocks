import { BACKEND_URL } from '../config'

const fetchWithoutToken = (endpoint, data, method = 'GET') => {
    const url = `${BACKEND_URL}/${endpoint}`;

    // console.log('url', url.replace(' ', '_'))

    if (method === 'GET') {
        return fetch(url);
    } else {
        return fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
};

export { fetchWithoutToken };