'use client'
import { useState } from 'react'
import { useGoals } from '@/hooks/useFirestore'
import { Goal } from '@/types'
import { Plus, Edit, Trash2, Target } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals()
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const categories = ['Personal', 'Professional', 'Health', 'Learning', 'Finance', 'Relationships']
  const statuses = ['not-started', 'in-progress', 'completed', 'paused']

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  const goalData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as Goal['category'],
    targetDate: new Date(formData.get('targetDate') as string),
    progress: parseInt(formData.get('progress') as string),
    status: formData.get('status') as Goal['status'],
  };

  // Immediately close the modal and reset editing state for instant UI feedback
  setShowModal(false);
  setEditingGoal(null);

  try {
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
      toast.success('Goal updated successfully!');
    } else {
      await addGoal(goalData);
      toast.success('Goal created successfully!');
    }
    form.reset();
  } catch (error) {
    toast.error('Failed to save goal');
    // Optional: reopen modal on failure
    setShowModal(true);
  }
};


  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id)
        toast.success('Goal deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete goal')
      }
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setShowModal(true)
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
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-2">Track and achieve your personal goals</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No goals</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first goal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {goal.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{goal.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Due: {format(goal.targetDate, 'MMM d, yyyy')}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  goal.status === 'paused' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
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
                    defaultValue={editingGoal?.title}
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
                    defaultValue={editingGoal?.description}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingGoal?.category}
                    className="form-input"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetDate"
                    required
                    defaultValue={editingGoal ? format(editingGoal.targetDate, 'yyyy-MM-dd') : ''}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    defaultValue={editingGoal?.progress || 0}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingGoal?.status || 'not-started'}
                    className="form-input"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingGoal(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGoal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}