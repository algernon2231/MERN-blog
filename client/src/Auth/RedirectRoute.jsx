import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext'

function RedirectRoute({ children }) {
    const [userInfo] = useContext(UserContext);
    // Check if user object is empty
    if (!userInfo || Object.keys(userInfo).length === 0) {
        return children
    }
    return <Navigate to='/' replace />
}
export default RedirectRoute