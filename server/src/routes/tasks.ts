import express, { Request, Response } from 'express'
import Task from '../models/TaskModel'
import authenticate from '../middleware/authMiddleware'

const router = express.Router()

router.post('/create', authenticate, async (req, res) => {
  try {
    const { task, category, browniePoints, isTop3Day, isTop3Week } = req.body

    // Ensure all required fields are present
    if (!task || !category || browniePoints === undefined) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const newTask = new Task({
      task,
      category,
      browniePoints,
      isTop3Day,
      isTop3Week,
      createdBy: ((req as any).user as { userId: string }).userId,
    })

    await newTask.save()
    res.status(201).json(newTask) // Send back the created task
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ((req as any).user as { userId: string }).userId,
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

router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { isCompleted } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Find and delete the task by its ID
    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res
      .status(200)
      .json({ message: 'Task deleted successfully', task: deletedTask })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
