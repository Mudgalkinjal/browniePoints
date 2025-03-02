import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'

export interface Task {
  _id: string
  task: string
  category: string
  tasks: number
  isTop3Day: boolean
  isTop3Week: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  isCompleted?: boolean
  browniePoints: number
}

interface TasksState {
  tasks: Task[]
  totalBrowniePoints: number
  completedCount: number
  incompletedCount: number
  loading: boolean
  error: string | null
}

const initialState: TasksState = {
  tasks: [],
  totalBrowniePoints: 0,
  completedCount: 0,
  incompletedCount: 0,
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('authToken')
    if (!token) return thunkAPI.rejectWithValue('No token found')
    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) return thunkAPI.rejectWithValue('Failed to fetch tasks')
    const data: Task[] = await response.json()
    return data
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload
      state.totalBrowniePoints = action.payload
        .filter((task: Task) => task.isCompleted)
        .reduce((sum: number, task: Task) => sum + task.browniePoints, 0)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false
      state.tasks = action.payload
      state.totalBrowniePoints = action.payload
        .filter((task) => task.isCompleted)
        .reduce((sum, task) => sum + task.browniePoints, 0)
      state.completedCount = action.payload.filter(
        (task) => task.isCompleted
      ).length
      state.incompletedCount = action.payload.filter(
        (task) => !task.isCompleted
      ).length
    })
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setTasks } = tasksSlice.actions
export default tasksSlice.reducer
