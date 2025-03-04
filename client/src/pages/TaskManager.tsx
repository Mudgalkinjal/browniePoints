import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../state/store'
import { fetchTasks } from '../state/brownies/tasksSlice'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { updateTaskAPI, deleteTaskAPI, createTaskAPI } from '../api/apiService'

const TaskManager = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { tasks, totalBrowniePoints, completedCount, incompletedCount } =
    useSelector((state: RootState) => state.brownie)

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks())
    }
  }, [tasks, dispatch])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [topTasks, setTopTasks] = useState<any[]>([])
  const [miscTasks, setMiscTasks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [animate, setAnimate] = useState(false)
  const [formData, setFormData] = useState({
    task: '',
    category: '',
    browniePoints: 0,
    isTop3Day: false,
    isTop3Week: false,
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 800)
    return () => clearTimeout(timer)
  }, [totalBrowniePoints])

  const filterTasks = useCallback(
    (tasksData: any[]) => {
      const filtered = selectedCategory
        ? tasksData.filter((t) => t.category === selectedCategory)
        : tasksData
      setTopTasks(filtered.filter((t) => t.isTop3Day || t.isTop3Week))
      setMiscTasks(filtered.filter((t) => !t.isTop3Day && !t.isTop3Week))
    },
    [selectedCategory]
  )

  useEffect(() => {
    filterTasks(tasks)
  }, [tasks, filterTasks])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category))
  }

  const handleHome = () => {
    navigate('/app')
  }

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      const token = localStorage.getItem('authToken')
      const changeReq = { isCompleted: !isCompleted }
      if (!token) throw new Error('No token found')
      await updateTaskAPI(taskId, changeReq, token)

      dispatch(fetchTasks())
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')
      await deleteTaskAPI(taskId, token)
      dispatch(fetchTasks())
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')
      await createTaskAPI(formData, token)

      setSuccessMessage('Task added successfully!')
      dispatch(fetchTasks())
      setFormData({
        task: '',
        category: '',
        browniePoints: 0,
        isTop3Day: false,
        isTop3Week: false,
      })
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred. Please try again.')
    }
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
        <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-gray-900 p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-extrabold mb-2">Total Brownie Points</h2>
          <p
            className={`inline-block ${
              animate ? 'bounce-three' : ''
            } text-4xl font-bold text-brown-800 flex items-center justify-center gap-2`}
          >
            {totalBrowniePoints} <span>🍫</span>
          </p>
          <div className="mt-4 text-lg font-medium">
            <span className="bg-gray-200 px-3 py-1 rounded-lg">
              ✅ Completed: {completedCount}
            </span>
            <span className="bg-gray-200 px-3 py-1 rounded-lg ml-2">
              ❌ Incomplete: {incompletedCount}
            </span>
          </div>
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
          <h3 className="text-lg font-semibold text-gray-800">
            Filter by Category:
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(
              new Set(tasks.map((t) => t.category || 'Uncategorized'))
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
                {category}
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
                        deleteTask(task._id)
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
                        deleteTask(task._id)
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
