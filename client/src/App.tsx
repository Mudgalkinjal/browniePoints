import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignUpPage from './pages/SignUpPage'
import Signinpage from './pages/Signinpage'
import Apppage from './pages/Apppage'
import AddBrownie from './pages/AddBrowniePage'

import VerifyEmail from './pages/VerifyEmail'
import ProtectedRoute from './components/ProtectedRoutes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<Signinpage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Apppage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-brownie"
          element={
            <ProtectedRoute>
              <AddBrownie />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
    // <div className="App">
    //   {' '}
    //   <Homepage />
    // </div>
  )
}

export default App
