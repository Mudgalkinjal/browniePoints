import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks } from '../state/brownies/tasksSlice'
import { fetchProtectedData } from '../api/apiService'
import { RootState, AppDispatch } from '../state/store'
import {
  BrowniePointsCard,
  FeatureSection,
  UserInfo,
  WhyBrowniePoints,
} from '../components/Dashboard'

const AppPage = () => {
  const [userData, setUserData] = useState<{
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const {
    totalBrowniePoints,
    completedCount,
    incompletedCount,
    loading: tasksLoading,
    error,
  } = useSelector((state: RootState) => state.brownie)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('No token found')
        const data = await fetchProtectedData(token)
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

  if (loading || tasksLoading) {
    return <div>Loading...</div>
  }
  if (!userData || error) {
    return <div>Error fetching user data. Please try again later.</div>
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-10">
      <Header />
      <div className="max-w-4xl mx-auto px-4">
        <UserInfo name={userData.name} email={userData.email} />
        <BrowniePointsCard
          totalBrowniePoints={totalBrowniePoints}
          completedCount={completedCount}
          incompletedCount={incompletedCount}
          animate={null}
        />
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/task-list')}
            className="px-4 py-3 m-4 bg-[#99c6ac] font-bold text-white rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg hover:text-gray-700 transition-all duration-200"
          >
            Go to your List
          </button>
        </div>
        <WhyBrowniePoints />
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureSection
            title="Gamify Your Productivity"
            description="Turn your daily tasks into exciting challenges. Earn brownie points for every completed task, and unlock rewards as you progress."
          />
          <FeatureSection
            title="Reflect and Celebrate"
            description="End your day by reflecting on your accomplishments and celebrating your brownie milestones!"
          />
          <FeatureSection
            title="Build Positive Habits"
            description="Reinforce good habits by staying consistent and earning brownie points daily. Every small step counts toward your success."
          />
          <FeatureSection
            title="Perfect for Teams"
            description="Share your progress with teammates and compete for the top spot. Collaborative productivity has never been more fun!"
          />
        </section>
      </div>
    </div>
  )
}

export default AppPage
