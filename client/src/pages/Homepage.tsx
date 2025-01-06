import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const HomePage = () => {
  const navigate = useNavigate()
  function handleSignUpNavigate() {
    navigate('/signup')
  }
  function handleSignInNavigate() {
    const authCode = localStorage.getItem('authToken')
    console.log(authCode)
    !authCode ? navigate('/signin') : navigate('/app')
  }
  return (
    <div className="min-h-screen bg-white pb-10">
      <Header />
      <div className="font-sans">
        {/* Hero Section */}
        <section className="bg-white text-gray-700 text-center py-12 px-4">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to Brownie Points!
          </h1>
          <p className="text-lg mb-8">
            A fun and engaging way to track your productivity, earn rewards, and
            celebrate achievements.
          </p>
          <button
            onClick={handleSignUpNavigate}
            className="px-6 py-3 bg-[#D4E4DB] text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
          >
            Get Started
          </button>
          <button
            onClick={handleSignInNavigate}
            className="px-6 py-3 ml-2 bg-[#D4E4DB] text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-200"
          >
            Sign In
          </button>
        </section>

        {/* Features Section */}
        <section className="bg-[#f58d7770] py-12 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-gray-600 text-lg">
              Boost your productivity and make goal setting fun with our Brownie
              Points system.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Set Goals
              </h3>
              <p className="text-gray-600">
                Define your top tasks and break them into actionable steps.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Earn Rewards
              </h3>
              <p className="text-gray-600">
                Complete tasks to earn Brownie Points and unlock fun rewards.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Stay Motivated
              </h3>
              <p className="text-gray-600">
                Track your progress and stay motivated with positive
                reinforcement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage
