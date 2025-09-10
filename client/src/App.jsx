import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MediTrustHero from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/UserDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediTrustHero />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App