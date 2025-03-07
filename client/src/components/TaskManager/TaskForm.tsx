import React, { useState } from 'react'
interface TaskFormData {
  task: string
  category: string
  browniePoints: number
  isTop3Day: boolean
  isTop3Week: boolean
}

interface TopTask {
  isTop3Day: boolean
}

interface TaskFormProps {
  onSubmit: (formData: TaskFormData) => Promise<void> | void
  topTasks: TopTask[]
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, topTasks }) => {
  const [formData, setFormData] = useState({
    task: '',
    category: '',
    browniePoints: 0,
    isTop3Day: false,
    isTop3Week: false,
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setSuccessMessage('Task added successfully!')
      setFormData({
        task: '',
        category: '',
        browniePoints: 0,
        isTop3Day: false,
        isTop3Week: false,
      })
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  return (
    <section className="bg-white shadow-lg rounded-lg p-8 my-4">
      <h2 className="text-xl font-bold text-black mb-4">Add a New Task</h2>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => handleInputChange('category', e.target.value)}
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
              disabled={topTasks.filter((task) => task.isTop3Day).length >= 3}
            >
              True
            </option>
            <option value="false">False</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#d5d5da] text-gray-700 rounded-lg shadow hover:bg-gray-300 hover:shadow-md transition-all duration-200"
        >
          Submit Task
        </button>
      </form>
    </section>
  )
}

export default TaskForm
