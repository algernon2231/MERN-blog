import React, { useCallback, useContext } from 'react';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useContext(UserContext);

    const handleSubmit = useCallback(async e => {
        e.preventDefault();
        const response = await fetch('http://127.0.0.1:4000/login', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        if (response.ok) {
            response.json().then(info => setUserInfo(info));
            const token = response.headers.get('Authorization');
            const accessToken = token.split(' ')[0];
            const refreshToken = token.split(' ')[1];
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);


        } else {
            alert('Wrong credentials');
        }
    }, [email, navigate, password, setUserInfo])

    return (
        <form className='login' onSubmit={handleSubmit}>
            <h1>LOGIN</h1>
            <input type="email"
                placeholder='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input type="password"
                placeholder='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button type='submit'>Login</button>
        </form>
    )
}

export default React.memo(Login)