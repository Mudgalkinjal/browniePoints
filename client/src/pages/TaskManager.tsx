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
  const [showInstructions, setShowInstructions] = useState(true)
  const [animate, setAnimate] = useState(false)
  const totalBrowniePoints = allTasks
    .filter((task) => task.isCompleted)
    .reduce((sum, task) => sum + task.browniePoints, 0)
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

      setAllTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      )
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
  const handleHome = () => {
    navigate('/app')
  }

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 800)
    return () => clearTimeout(timer)
  }, [totalBrowniePoints])
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

  const filterTasks = (tasks: Task[]) => {
    const filtered = selectedCategory
      ? tasks.filter((t) => t.category === selectedCategory)
      : tasks
    setTopTasks(filtered.filter((t) => t.isTop3Day || t.isTop3Week))
    setMiscTasks(filtered.filter((t) => !t.isTop3Day))
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
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add task')
      }

      const newTask = await response.json()
      setAllTasks((prev) => [...prev, newTask])
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
    const fetchTasksAndFilter = async () => {
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

        const filtered = selectedCategory
          ? data.filter((t: Task) => t.category === selectedCategory)
          : data

        setTopTasks(filtered.filter((t: Task) => t.isTop3Day || t.isTop3Week))
        setMiscTasks(
          filtered.filter((t: Task) => !t.isTop3Day && !t.isTop3Week)
        )
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasksAndFilter()
  }, [selectedCategory])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('No token found')

        const response = await fetch(`${API_URL}/api/auth/protected`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) throw new Error('Failed to fetch user data')

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
        <div className="mb-4">
          <button
            onClick={handleHome}
            className="text-blue-600 hover:underline"
          >
            Go to Homepage
          </button>
        </div>

        <div className="bg-[#f58d774a] p-4 rounded-lg mb-6 shadow hover:shadow-lg transition-all duration-300">
          <p className="text-center text-lg font-semibold text-gray-700 italic">
            "A little progress each day adds up to big results."
          </p>
        </div>

        <div className="bg-white p-2 rounded-lg text-center text-2xl font-bold mb-4">
          Total Brownie Points:{' '}
          <span className={`inline-block ${animate ? 'bounce-three' : ''}`}>
            {totalBrowniePoints} 🍫
          </span>
        </div>

        {showInstructions && (
          <section className="relative bg-[#D4E4DB] p-4 rounded-lg mb-6 shadow-lg">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-2 right-2 text-gray-800 hover:text-red-500"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-2">How to Use</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Create tasks with the "Add More Tasks" button.</li>
              <li>Filter tasks by category using the buttons above.</li>
              <li>Click on tasks to mark them as completed.</li>
              <li>Delete tasks if needed.</li>
            </ul>
          </section>
        )}

        <div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Filter by Category:
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(
              new Set(allTasks.map((t) => t.category || 'Uncategorized'))
            ).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow hover:shadow-md transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#D4E4DB] hover:bg-[#c5d7cc]'
                    : 'bg-[#d5d5da] hover:bg-gray-300'
                }`}
              >
                {category?.toString() || 'Uncategorized'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 justify-center mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-[#7f9d89] text-white px-4 py-2 rounded-lg"
          >
            {showForm ? 'Hide Form' : 'Add More Tasks'}
          </button>
        </div>

        {showForm && (
          <section className="bg-white shadow-lg rounded-lg p-8 my-4">
            <h2 className="text-xl font-bold text-black-500 mb-4">
              Add a New Task
            </h2>
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
                  min={1}
                  onChange={(e) =>
                    handleInputChange(
                      'browniePoints',
                      parseInt(e.target.value, 10) || 1
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
                  <option
                    value="true"
                    disabled={
                      topTasks.filter((task) => task.isTop3Day).length >= 3
                    }
                  >
                    True
                  </option>
                  <option value="false">False</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#d5d5da] text-gray-700 rounded-lg shadow hover:bg-gray-300 hover:shadow-md hover:text-gray-900 transition-all duration-200"
              >
                Submit Task
              </button>
            </form>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">Top Tasks</h2>
            {topTasks.length === 0 ? (
              <p className="text-gray-500 italic">No top tasks available.</p>
            ) : (
              topTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() =>
                    toggleTaskCompletion(task._id, task.isCompleted || false)
                  }
                  className={`cursor-pointer bg-[#f58d7770] p-3 rounded-lg mb-2 shadow hover:shadow-md transition-all duration-200 flex items-center justify-between ${
                    task.isCompleted
                      ? 'bg-[#D4E4DB] line-through text-gray-400'
                      : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">
                      {task.task || 'Untitled Task'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Points: {task.browniePoints?.toString() || '0'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 italic">
                      {task.category || 'No Category'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task._id, setAllTasks)
                      }}
                      className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 shadow transition-all duration-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">Other Tasks</h2>
            {miscTasks.length === 0 ? (
              <p className="text-gray-500 italic">
                No miscellaneous tasks available.
              </p>
            ) : (
              miscTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() =>
                    toggleTaskCompletion(task._id, task.isCompleted || false)
                  }
                  className={`cursor-pointer bg-[#8adafd70] p-3 rounded-lg mb-2 shadow hover:shadow-md transition-all duration-200 flex items-center justify-between ${
                    task.isCompleted
                      ? 'bg-[#D4E4DB] line-through text-gray-400'
                      : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">
                      {task.task || 'Untitled Task'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Points: {task.browniePoints?.toString() || '0'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 italic">
                      {task.category || 'No Category'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTask(task._id, setAllTasks)
                      }}
                      className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 shadow transition-all duration-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default TaskManager
