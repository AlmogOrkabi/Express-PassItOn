/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AppContextProvider, { AppContext } from './contexts/AppContext'

import './index.css'

import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'
import OverView from './pages/OverView'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Posts from './pages/Posts'
import Requests from './pages/Requests'
import Statistics from './pages/Statistics'


function App() {


  return (
    <>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Overview' element={<OverView />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/users' element={<Users />} />
            <Route path='/posts' element={<Posts />} />
            <Route path='/requests' element={<Requests />} />
            <Route path='/statistics' element={<Statistics />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </>
  )
}

export default App
