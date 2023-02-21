import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import jwt_decode from 'jwt-decode'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useContext(UserContext);

    const token = useMemo(() => localStorage.getItem('token'), []);
    useEffect(() => {
        if (token) {
            const decoded = jwt_decode(token);
            setUserInfo(decoded);
        }
    }, [token, setUserInfo]);
    const logOut = useCallback(() => {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST'
        });
        localStorage.removeItem('token');
        setUserInfo(null);
        localStorage.setItem('lastLocation', location.pathname);
        navigate('/login')
    }, [location.pathname, navigate, setUserInfo]);

    const username = useMemo(() => userInfo?.username, [userInfo]);
    return (
        <header>
            <Link to="/" className='logo'>MyBlog</Link>
            <nav>
                {username && <>
                    <Link to='/create' className='navLink'>CreatePost</Link>
                    <a onClick={logOut} className='navLink' >Logout</a>
                </>}
                {!username && <>
                    <Link to="/login" className='navLink'>Login</Link>
                    <Link to="/register" className='navLink'>Register</Link>
                </>}
            </nav>
        </header>
    )
}

export default Header