import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../state/store'
import { fetchTasks } from '../state/brownies/tasksSlice'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { updateTaskAPI, deleteTaskAPI, createTaskAPI } from '../api/apiService'
import { BrowniePointsCard } from '../components/Dashboard'
import {
  TaskFilter,
  TaskList,
  TaskForm,
  Instructions,
} from '../components/TaskManager'

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
      if (!token) throw new Error('No token found')
      await updateTaskAPI(taskId, { isCompleted: !isCompleted }, token)
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

  const handleFormSubmit = async (formData: any) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')
    await createTaskAPI(formData, token)
    dispatch(fetchTasks())
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

        <BrowniePointsCard
          totalBrowniePoints={totalBrowniePoints}
          completedCount={completedCount}
          incompletedCount={incompletedCount}
        />
        {showInstructions && (
          <Instructions onClose={() => setShowInstructions(false)} />
        )}
        <TaskFilter
          tasks={tasks}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
        <div className="flex flex-1 justify-center mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-[#7f9d89] text-white px-4 py-2 rounded-lg"
          >
            {showForm ? 'Hide Form' : 'Add More Tasks'}
          </button>
        </div>
        {showForm && (
          <TaskForm onSubmit={handleFormSubmit} topTasks={topTasks} />
        )}
        <TaskList
          topTasks={topTasks}
          miscTasks={miscTasks}
          onToggleCompletion={toggleTaskCompletion}
          onDelete={deleteTask}
        />
      </div>
    </div>
  )
}

export default TaskManager
