import React from 'react'
// export interface Task {
//     _id: string
//     task: string
//     category: string
//     tasks: number
//     isTop3Day: boolean
//     isTop3Week: boolean
//     createdAt: string
//     updatedAt: string
//     createdBy: string
//     isCompleted?: boolean
//     browniePoints: number
//   }

//   interface TasksState {
//     tasks: Task[]
//     totalBrowniePoints: number
//     completedCount: number
//     incompletedCount: number
//     loading: boolean
//     error: string | null
//   }

//   const initialState: TasksState = {
//     tasks: [],
//     totalBrowniePoints: 0,
//     completedCount: 0,
//     incompletedCount: 0,
//     loading: false,
//     error: null,
//   }
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
type TaskFilterType = {
  tasks: Task[]
  selectedCategory: string | null
  onCategoryClick: (category: string) => void
}
const TaskFilter: React.FC<TaskFilterType> = ({
  tasks,
  selectedCategory,
  onCategoryClick,
}) => {
  const categories = Array.from(
    new Set(tasks.map((t) => t.category || 'Uncategorized'))
  )
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">
        Filter by Category:
      </h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
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
  )
}

export default TaskFilter
