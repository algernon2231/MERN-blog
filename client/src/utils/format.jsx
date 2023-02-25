import jwt_decode from 'jwt-decode'
export const slugify = (...args) => {
    const value = args.join(' ');
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
}

export const ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export const isTokenExpired = (token) => {
    const decodedToken = jwt_decode(token);
    const currentTime = new Date();
    if (decodedToken.exp * 1000 < currentTime.getTime()) {
        return true; // token has expired
    } else {
        return false; // token is still valid
    }
}

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    let response = await fetch('http://localhost:4000/refreshToken', {
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
    return data.accessToken;
}


