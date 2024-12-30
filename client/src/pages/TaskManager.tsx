import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

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
  isCompleted?: boolean
}

const TaskManager = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState<{
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [topTasks, setTopTasks] = useState<Task[]>([])
  const [miscTasks, setMiscTasks] = useState<Task[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    task: '',
    category: '',
    browniePoints: 0,
    isTop3Day: false,
    isTop3Week: false,
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const deleteTask = async (
    taskId: string,
    setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      const data = await response.json()

      // Update the state to reflect the deleted task
      setAllTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      )
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')

      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()

      setAllTasks(data)
      filterTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  // Filter tasks based on selected category
  const filterTasks = (tasks: Task[]) => {
    const filtered = selectedCategory
      ? tasks.filter((t) => t.category === selectedCategory)
      : tasks
    setTopTasks(filtered.filter((t) => t.isTop3Day || t.isTop3Week))
    setMiscTasks(filtered.filter((t) => !t.isTop3Day && !t.isTop3Week))
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category))
    filterTasks(allTasks)
  }

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')

      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !isCompleted }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      // Update the local state
      const updatedTask = await response.json()
      setAllTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, isCompleted: updatedTask.isCompleted }
            : task
        )
      )

      filterTasks(
        allTasks.map((task) =>
          task._id === taskId
            ? { ...task, isCompleted: updatedTask.isCompleted }
            : task
        )
      )
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }
  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  // Add task
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')

      const response = await fetch(`${API_URL}/api/tasks/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure this is a single object
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add task')
      }

      const newTask = await response.json() // Assuming the server returns the created task
      setAllTasks((prev) => [...prev, newTask]) // Add the new task to the list
      setFormData({
        task: '',
        category: '',
        browniePoints: 0,
        isTop3Day: false,
        isTop3Week: false,
      })
      setSuccessMessage('Task added successfully!')
      fetchTasks()
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks(allTasks)
  }, [selectedCategory])

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
    <div className="min-h-screen bg-gray-50 pb-10">
      <Header />

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Manage Your Tasks
        </h1>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {Array.from(
              new Set(allTasks.map((t) => t.category || 'Uncategorized'))
            ).map((category) => (
              <button
                key={category} // Ensure unique key
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category ? 'bg-green-200' : 'bg-gray-100'
                }`}
              >
                {category?.toString() || 'Uncategorized'}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex">
          <section className="bg-white shadow-lg rounded-lg p-8 w-6/12 mr-4">
            <h2 className="text-2xl font-bold text-green-500 mb-4 text-center">
              Your Task List
            </h2>

            {/* Top Priority Tasks */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Top Priority Tasks
            </h3>
            {topTasks.map((task) => (
              <div
                key={task._id}
                onClick={() =>
                  toggleTaskCompletion(task._id, task.isCompleted || false)
                }
                className={`bg-gray-100 p-4 rounded-lg mb-2 ${
                  task.isCompleted
                    ? 'bg-green-100 line-through text-gray-400'
                    : ''
                }`}
              >
                <h4 className="text-lg font-semibold">
                  {task.task || 'Untitled Task'}
                </h4>
                <p>Category: {task.category || 'No Category'}</p>
                <p>Points: {task.browniePoints?.toString() || '0'}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Prevent task toggle
                    deleteTask(task._id, setAllTasks)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}

            {miscTasks.map((task) => (
              <div
                key={task._id}
                onClick={() =>
                  toggleTaskCompletion(task._id, task.isCompleted || false)
                }
                className={`cursor-pointer bg-gray-100 p-4 rounded-lg mb-2 ${
                  task.isCompleted
                    ? 'bg-green-100 line-through text-gray-400'
                    : ''
                }`}
              >
                <h4 className="text-lg font-semibold">
                  {task.task || 'Untitled Task'}
                </h4>
                <p>Category: {task.category || 'No Category'}</p>
                <p>Points: {task.browniePoints?.toString() || '0'}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Prevent task toggle
                    deleteTask(task._id, setAllTasks)
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </section>

          {/* Add Task Form */}
          {showForm && (
            <section className="bg-white shadow-lg rounded-lg p-8 w-4/12">
              <h2 className="text-xl font-bold mb-4">Add a New Task</h2>
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}

              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Task</label>
                  <input
                    name="task"
                    value={formData.task}
                    onChange={(e) => handleInputChange('task', e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Brownie Points</label>
                  <input
                    name="browniePoints"
                    type="number"
                    value={formData.browniePoints}
                    onChange={(e) =>
                      handleInputChange(
                        'browniePoints',
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Top 3 Task</label>
                  <select
                    value={formData.isTop3Day ? 'true' : 'false'}
                    onChange={(e) =>
                      handleInputChange('isTop3Day', e.target.value === 'true')
                    }
                    className="w-full p-2 border rounded-lg mb-4"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Submit Task
                </button>
              </form>
            </section>
          )}
        </div>

        {/* Toggle Add Task Button */}
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Hide Form' : 'Add More Tasks'}
        </button>
      </div>
    </div>
  )
}

export default TaskManager
