import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Protected from './Auth/Protected'
import RedirectRoute from './Auth/RedirectRoute'
import CreatePost from './components/CreatePost'
import EditPost from './components/EditPost'
import GetPostByName from './components/GetPostByName'
import IndexPage from './components/IndexPage'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import SinglePost from './components/SinglePost'
import { UserContext } from './UserContext'

const App = () => {
  const [userInfo] = useContext(UserContext);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path='/login' element={
          <RedirectRoute>
            <Login />
          </RedirectRoute>
        } />
        <Route path='/register' element={
          <RedirectRoute>
            <Register />
          </RedirectRoute>
        } />
        <Route path='/create' element={
          <Protected >
            <CreatePost />
          </Protected>
        } />
        <Route path='/post/:slug' element={<SinglePost />} />
        <Route path='/edit/:slug' element={
          <Protected>
            <EditPost />
          </Protected>
        } />
        <Route path='/post/getByName' element={<GetPostByName />} />
      </Route>
    </Routes>
  )
}

export default App