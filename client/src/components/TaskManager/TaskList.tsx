import React from 'react'
import TaskItem from './TaskItem'
interface Task {
  _id: number
}
type TaskListType = {
  topTasks: Task[]
  miscTasks: Task[]
  onToggleCompletion: (taskId: any, isCompleted: boolean) => void
  onDelete: (taskId: any) => void
}

const TaskList: React.FC<TaskListType> = ({
  topTasks,
  miscTasks,
  onToggleCompletion,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <section className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Top Tasks</h2>
        {topTasks.length === 0 ? (
          <p className="text-gray-500 italic">No top tasks available.</p>
        ) : (
          topTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleCompletion={onToggleCompletion}
              onDelete={onDelete}
            />
          ))
        )}
      </section>

      <section className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-4">Other Tasks</h2>
        {miscTasks.length === 0 ? (
          <p className="text-gray-500 italic">
            No miscellaneous tasks available.
          </p>
        ) : (
          miscTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleCompletion={onToggleCompletion}
              onDelete={onDelete}
            />
          ))
        )}
      </section>
    </div>
  )
}

export default TaskList
