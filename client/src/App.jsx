import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MediTrustHero from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/user/UserDashboard'
import Profile from './pages/user/Profile'
import DonationHistory from './pages/user/UserHistory'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediTrustHero />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<DonationHistory />} />
      </Routes>
    </Router>
  )
}

export default App