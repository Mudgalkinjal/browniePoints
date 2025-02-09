import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'

const AppPage = () => {
  const [userData, setUserData] = useState<{
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function handleList() {
    navigate('/task-list')
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await fetch(`${API_URL}/api/auth/protected`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUserData({ name: data.user.name, email: data.user.email })
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Error fetching user data. Please try again later.</div>
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-10">
      <Header />

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Welcome, {userData.name}!
          </h1>
          <p className="text-center text-gray-600">
            Your email: <strong>{userData.email}</strong>
          </p>
        </header>
        <div className="flex justify-center">
          <button
            onClick={handleList}
            className="px-4 py-3 m-4 bg-[#D4E4DB] text-gray-700 rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg transition-all duration-200"
          >
            Go to your List
          </button>
        </div>

        {/* Hero Section */}
        <section className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black-400 mb-4 text-center">
            Why Brownie Points?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Brownie Points</strong> is your companion for boosting
            productivity, helping you achieve your goals while making the
            process fun and rewarding. By gamifying your tasks, Brownie Points
            keeps you motivated and focused.
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-700">
            <li>
              <strong>Set achievable goals</strong> and track your progress
              step-by-step.
            </li>
            <li>
              <strong>Earn rewards</strong> for completing tasks to keep you
              motivated.
            </li>
            <li>
              <strong>Visualize success</strong> with brownie-themed
              achievements.
            </li>
            <li>Stay consistent with reminders and daily points.</li>
          </ul>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Gamify Your Productivity
            </h3>
            <p className="text-gray-700">
              Turn your daily tasks into exciting challenges. Earn brownie
              points for every completed task, and unlock rewards as you
              progress.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Reflect and Celebrate
            </h3>
            <p className="text-gray-700">
              End your day by reflecting on your accomplishments and celebrating
              your brownie milestones!
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Build Positive Habits
            </h3>
            <p className="text-gray-700">
              Reinforce good habits by staying consistent and earning brownie
              points daily. Every small step counts toward your success.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Perfect for Teams
            </h3>
            <p className="text-gray-700">
              Share your progress with teammates and compete for the top spot.
              Collaborative productivity has never been more fun!
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AppPage
