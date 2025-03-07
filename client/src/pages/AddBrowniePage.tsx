import React, { useState } from 'react'
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'

const AddBrowniePage = () => {
  const [formData, setFormData] = useState({
    task: '',
    category: '',
    browniePoints: 0,
    top3Day: false,
    top3Week: false,
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    const inputValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem('authToken')
    e.preventDefault()

    setSuccessMessage('')
    setErrorMessage('')

    console.log('Submitting:', formData)

    if (!formData.task || !formData.category || formData.browniePoints < 1) {
      setErrorMessage('Please fill out all required fields correctly.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Success Response:', data)
        setSuccessMessage('Task added successfully!')
        setFormData({
          task: '',
          category: '',
          browniePoints: 1,
          top3Day: false,
          top3Week: false,
        })
      } else {
        const errorData = await response.json()
        console.error('Error Response:', errorData)
        setErrorMessage(errorData.message || 'Failed to add task')
      }
    } catch (error) {
      console.error('Request Error:', error)
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-green-500 mb-6 text-center">
          Add a New Brownie Task
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700"
            >
              Task
            </label>
            <input
              id="task"
              name="task"
              type="text"
              value={formData.task}
              onChange={handleChange}
              required
              placeholder="Enter your task"
              className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring focus:ring-green-200"
            >
              <option value="">Select a category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="browniePoints"
              className="block text-sm font-medium text-gray-700"
            >
              Brownie Points
            </label>
            <input
              id="browniePoints"
              name="browniePoints"
              type="number"
              min="1"
              max="10"
              value={formData.browniePoints}
              onChange={handleChange}
              required
              placeholder="Assign points (1-10)"
              className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center text-gray-700">
              <input
                name="top3Day"
                type="checkbox"
                checked={formData.top3Day}
                onChange={handleChange}
                className="mr-2"
              />
              Mark as Top 3 of the Day
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center text-gray-700">
              <input
                name="top3Week"
                type="checkbox"
                checked={formData.top3Week}
                onChange={handleChange}
                className="mr-2"
              />
              Mark as Top 3 of the Week
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBrowniePage
