import React from 'react'
import { useState } from 'react'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async e => {
        e.preventDefault();
        await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: { 'Content-Type': 'application/json' }
        })

    }
    return (
        <form className='register' onSubmit={handleRegister}>
            <h1>REGISTER</h1>
            <input type="text"
                placeholder='username'
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
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
            <button type='submit'>Register</button>
        </form>
    )
}

export default Register