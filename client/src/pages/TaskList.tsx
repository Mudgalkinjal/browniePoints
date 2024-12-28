import React, { useState, useEffect } from 'react'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'

interface Task {
  _id: string
  task: string
  category: string
  browniePoints: number
  isTop3Day: boolean
  isTop3Week: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  isCompleted?: boolean // Added this property
}

const TaskList = () => {
  const [userData, setUserData] = useState<{
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [topTasks, setTopTasks] = useState<Task[]>([])
  const [miscTasks, setMiscTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('authToken') // Use the same token key as fetchUserData
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      console.log('Response:', response)
      const data = await response.json()
      console.log('Data:', data)
      setAllTasks(data)

      const top = data.filter(
        (task: { isTop3Day: any; isTop3Week: any }) =>
          task.isTop3Day || task.isTop3Week
      )
      const misc = data.filter(
        (task: { isTop3Day: any; isTop3Week: any }) =>
          !task.isTop3Day && !task.isTop3Week
      )

      setTopTasks(top)
      setMiscTasks(misc)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

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
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Error fetching user data. Please try again later.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
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
        <div className="flex">
          {/* Hero Section */}
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8 w-6/12 mr-4">
            <h2 className="text-2xl font-bold text-green-500 mb-4 text-center">
              Your Task List
            </h2>

            {/* Top Priority Tasks */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                Top Priority Tasks
              </h3>
              <div className="space-y-4">
                {topTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-2">
                        {task.category}
                      </span>
                      <h4
                        className={`text-lg ${
                          task.isCompleted
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {task.task}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(task.createdAt)}
                      </p>
                    </div>
                    {task.isCompleted && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Miscellaneous Tasks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Miscellaneous Tasks
              </h3>
              <div className="space-y-3">
                {miscTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-2">
                        {task.category}
                      </span>
                      <h4
                        className={`${
                          task.isCompleted
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {task.task}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(task.createdAt)}
                      </p>
                    </div>
                    {task.isCompleted && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="bg-white shadow-lg rounded-lg p-8 mb-8 w-4/12">
            {allTasks.map((task, id) => (
              <div key={id}>{task.category}</div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

export default TaskList
