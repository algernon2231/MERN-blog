import React, { lazy, useContext, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Protected from './Auth/Protected';
import RedirectRoute from './Auth/RedirectRoute';
import LoadingImage from './components/LoadingImage';

const CreatePost = lazy(() => import('./components/CreatePost'));
const EditPost = lazy(() => import('./components/EditPost'));
const GetPostByName = lazy(() => import('./components/GetPostByName'));
const IndexPage = lazy(() => import('./components/IndexPage'));
const Layout = lazy(() => import('./components/Layout'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const SinglePost = lazy(() => import('./components/SinglePost'));

import { UserContext } from './UserContext';

const App = () => {
  const [userInfo] = useContext(UserContext);

  return (
    <Routes>
      <Route path='/' element={<Suspense fallback={<LoadingImage />}><Layout /></Suspense>}>
        <Route index element={<Suspense fallback={<div>Loading...</div>}><IndexPage /></Suspense>} />
        <Route path='/login' element={
          <RedirectRoute>
            <Suspense fallback={<LoadingImage />}><Login /></Suspense>
          </RedirectRoute>
        } />
        <Route path='/register' element={
          <RedirectRoute>
            <Suspense fallback={<LoadingImage />}><Register /></Suspense>
          </RedirectRoute>
        } />
        <Route path='/create' element={
          <Protected >
            <Suspense fallback={<LoadingImage />}><CreatePost /></Suspense>
          </Protected>
        } />
        <Route path='/post/:slug' element={<Suspense fallback={<LoadingImage />}><SinglePost /></Suspense>} />
        <Route path='/edit/:slug' element={
          <Protected>
            <Suspense fallback={<LoadingImage />}><EditPost /></Suspense>
          </Protected>
        } />
        <Route path='/post/getByName' element={<Suspense fallback={<LoadingImage />}><GetPostByName /></Suspense>} />
      </Route>
    </Routes>
  )
}
export default App;
