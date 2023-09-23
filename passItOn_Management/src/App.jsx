/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AppContextProvider, { AppContext } from './contexts/AppContext'

import './index.css'

import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'
import OverView from './pages/OverView'


function App() {


  return (
    <>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Overview' element={<OverView />} />
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </>
  )
}

export default App
