import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../state/store'
import { fetchTasks } from '../state/brownies/tasksSlice'
import Header from '../components/Header'
import { updateTaskAPI, deleteTaskAPI, createTaskAPI } from '../api/apiService'
import { BrowniePointsCard } from '../components/Dashboard'
import MenuBar from '../components/MenuBar'

import {
  TaskFilter,
  TaskList,
  TaskForm,
  Instructions,
} from '../components/TaskManager'

const TaskManager = () => {
  const dispatch = useDispatch<AppDispatch>()
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
  const [showInstructions, setShowInstructions] = useState(() => {
    return !localStorage.getItem('instructionsClosed')
  })
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

  const handleInstructionsClose = () => {
    localStorage.setItem('instructionsClosed', 'true')
    setShowInstructions(false)
  }

  const handleFormSubmit = async (formData: any) => {
    const token = localStorage.getItem('authToken')
    if (!token) throw new Error('No token found')
    await createTaskAPI(formData, token)
    dispatch(fetchTasks())
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] pb-10">
      <MenuBar />
      <Header />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-gray-300 p-4 rounded-lg mb-6 shadow hover:shadow-lg transition-all duration-300">
          <p className="text-center text-lg font-semibold text-gray-700 italic">
            "A little progress each day adds up to big results."
          </p>
        </div>

        <BrowniePointsCard
          totalBrowniePoints={totalBrowniePoints}
          completedCount={completedCount}
          incompletedCount={incompletedCount}
          animate={animate}
        />
        {showInstructions && <Instructions onClose={handleInstructionsClose} />}
        {tasks.length !== 0 && (
          <TaskFilter
            tasks={tasks}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        )}

        <div className="flex flex-1 justify-center mb-4">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="px-4 py-3 m-4 bg-[#99c6ac] font-bold text-white rounded-lg shadow-md hover:bg-gray-300 hover:shadow-lg hover:text-gray-700 transition-all duration-200"
          >
            {showForm ? 'Hide Form' : 'Add More Tasks'}
          </button>
        </div>
        {showForm && (
          <TaskForm onSubmit={handleFormSubmit} topTasks={topTasks} />
        )}
        {tasks.length !== 0 && (
          <TaskList
            topTasks={topTasks}
            miscTasks={miscTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDelete={deleteTask}
          />
        )}
      </div>
    </div>
  )
}

export default TaskManager
