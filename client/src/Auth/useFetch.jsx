import { isTokenExpired } from '../utils/format';

let useFetch = () => {
    let config = {}
    let baseURL = 'http://localhost:4000'

    let originalRequest = async (url, method, body, config) => {
        config.method = method;
        config['credentials'] = 'include'
        config.body = body;
        let response = await fetch(url, config);
        let data = await response.json()
        console.log('REQUESTING:', data)
        return { response, data }
    }

    let refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log(refreshToken);
        let response = await fetch(`${baseURL}/refreshToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 'token': refreshToken })
        })
        let data = await response.json()
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.accessToken
    }

    let callFetch = async (url, method, body) => {
        const token = localStorage.getItem('token');
        let data1 = {};
        if (isTokenExpired(token)) {
            data1.accessToken = await refreshToken();
        }
        config['headers'] = {
            Authorization: data1.accessToken
        }
        let { response, data } = await originalRequest(url, method, body, config)
        return { response, data }
    }
    return { callFetch }
}

export default useFetch;
