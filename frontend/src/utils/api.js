import { BACKEND_URL } from '../config';

const fetchWithoutToken = (endpoint, data, method = 'GET') => {
    const url = `${BACKEND_URL}/${endpoint}`;
    // console.log(url);

    if (method === 'GET') {
        return fetch(url);
    } else {
        return fetch(url, {
            method,
            body: data,
        });
    }
};

export { fetchWithoutToken };