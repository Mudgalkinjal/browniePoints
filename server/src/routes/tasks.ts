import express, { Request, Response } from 'express'
import Task from '../models/TaskModel'
import authenticate from '../middleware/authMiddleware'

const router = express.Router()

// Create a New Task
router.post('/create', authenticate, async (req: Request, res: Response) => {
  console.log('Request Headers:', req.headers)
  try {
    const { task, category, browniePoints, isTop3Day, isTop3Week } = req.body

    const newTask = new Task({
      task,
      category,
      browniePoints,
      isTop3Day,
      isTop3Week,
      createdBy: ((req as any).user as { userId: string }).userId,
    })

    await newTask.save()
    res
      .status(201)
      .json({ message: 'Task created successfully', task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Fetch All Tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
    res.status(200).json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
