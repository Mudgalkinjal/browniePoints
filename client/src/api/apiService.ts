const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:5001'

export const fetchTasksAPI = async (token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error('Failed to fetch tasks')
  return await response.json()
}

export const updateTaskAPI = async (
  taskId: string,
  updateData: any,
  token: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })
  if (!response.ok) throw new Error('Failed to update task')
  return await response.json()
}

export const deleteTaskAPI = async (
  taskId: string,
  token: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error('Failed to delete task')
  return await response.json()
}

export const createTaskAPI = async (
  taskData: any,
  token: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/api/tasks/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to add task')
  }
  return await response.json()
}

export const fetchProtectedData = async (token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/auth/protected`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error('Failed to fetch protected data')
  return await response.json()
}
