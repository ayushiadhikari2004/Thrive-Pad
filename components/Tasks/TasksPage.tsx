'use client'
import { useState } from 'react'
import { useTasks } from '@/hooks/useFirestore'
import { Task } from '@/types'
import { Plus, Edit, Trash2, CheckSquare, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function TasksPage() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState('all')

  const priorities = ['low', 'medium', 'high']
  const statuses = ['pending', 'in-progress', 'completed']

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'pending') return task.status === 'pending'
    if (filter === 'completed') return task.status === 'completed'
    if (filter === 'overdue') {
      return task.status !== 'completed' && new Date(task.dueDate) < new Date()
    }
    return true
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  const taskData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    dueDate: new Date(formData.get('dueDate') as string),
    priority: formData.get('priority') as Task['priority'],
    status: formData.get('status') as Task['status'],
    reminder: formData.get('reminder') === 'on',
    reminderTime: formData.get('reminderTime') ? new Date(formData.get('reminderTime') as string) : undefined,
  };

  // Close modal immediately on submit
  setShowModal(false);
  setEditingTask(null);

  try {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      toast.success('Task updated successfully!');
    } else {
      await addTask(taskData);
      toast.success('Task created successfully!');
    }
    form.reset();
  } catch (error) {
    toast.error('Failed to save task');
    // Optional: reopen modal on failure
    setShowModal(true);
  }
};


  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id)
        toast.success('Task deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      await updateTask(task.id, { status: newStatus })
      toast.success(`Task marked as ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your daily tasks and reminders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'completed', label: 'Completed' },
            { id: 'overdue', label: 'Overdue' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date()

            return (
              <div
                key={task.id}
                className={`card flex items-center justify-between ${
                  task.status === 'completed' ? 'opacity-75' : ''
                } ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.status === 'completed' && <CheckSquare className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(task.dueDate, 'MMM d, yyyy')}
                        {isOverdue && <span className="text-red-600 ml-1">(Overdue)</span>}
                      </span>
                      {task.reminder && (
                        <span className="text-xs text-blue-600">🔔 Reminder</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingTask?.title}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingTask?.description}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    defaultValue={editingTask ? format(editingTask.dueDate, 'yyyy-MM-dd') : ''}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    defaultValue={editingTask?.priority || 'medium'}
                    className="form-input"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingTask?.status || 'pending'}
                    className="form-input"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="reminder"
                    defaultChecked={editingTask?.reminder}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Enable reminder
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Time (optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="reminderTime"
                    defaultValue={editingTask?.reminderTime ? format(editingTask.reminderTime, "yyyy-MM-dd'T'HH:mm") : ''}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTask(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}