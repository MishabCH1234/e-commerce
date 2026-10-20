import { useState } from 'react'

import './App.css'
import Homepage from './pages/Home'
import Login from './pages/Login'
import { Routes, Route } from 'react-router-dom'
function App() {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Homepage />} />
    </Routes>
   

  )
}

export default App
