import React from 'react'
interface Task {
  _id: number
  isCompleted?: boolean
  task?: string
  browniePoints?: number
  category?: string
}

type TaskItemType = {
  task: Task
  onToggleCompletion: (taskId: number, isCompleted: boolean) => void
  onDelete: (taskId: number) => void
}

const TaskItem: React.FC<TaskItemType> = ({
  task,
  onToggleCompletion,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onToggleCompletion(task._id, task.isCompleted || false)}
      className={`cursor-pointer bg-[#f58d7770] p-3 rounded-lg mb-2 shadow hover:shadow-md transition-all duration-200 flex items-center justify-between ${
        task.isCompleted ? 'bg-[#D4E4DB] line-through text-gray-400' : ''
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
            onDelete(task._id)
          }}
          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 shadow transition-all duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default TaskItem
