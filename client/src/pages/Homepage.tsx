import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/Homepage/HeroSection'
import FeaturesSection from '../components/Homepage/FeaturesSection'

const HomePage = () => {
  const navigate = useNavigate()

  const handleSignUpNavigate = () => navigate('/signup')
  const handleSignInNavigate = () => {
    const authCode = localStorage.getItem('authToken')
    !authCode ? navigate('/signin') : navigate('/app')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="font-sans">
        <HeroSection
          onSignUp={handleSignUpNavigate}
          onSignIn={handleSignInNavigate}
        />
        <FeaturesSection />
      </div>
    </div>
  )
}

export default HomePage
