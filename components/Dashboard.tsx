'use client'
import { useGoals, useTasks, useJournal } from '@/hooks/useFirestore'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user } = useAuth()
  const { goals } = useGoals()
  const { tasks } = useTasks()
  const { entries } = useJournal()

  const activeGoals = goals.filter(g => g.status === 'in-progress').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const thisWeekEntries = entries.filter(e => {
    const entryDate = new Date(e.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  }).length
  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center">
            Welcome back,
            <span className="ml-3 text-indigo-600">{user?.displayName || 'User'}!</span>
          </h1>
          <p className="mt-2 text-lg text-gray-500">Here&apos;s your productivity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="flex flex-col bg-white shadow-xl rounded-2xl p-6 border-t-4 border-blue-500 hover:scale-105 transition-all">
            <span className="text-4xl mb-3 text-blue-400">🎯</span>
            <div className="text-2xl font-bold text-gray-900">{activeGoals}</div>
            <p className="text-sm text-gray-500 mt-1">Active goals</p>
          </div>
          <div className="flex flex-col bg-white shadow-xl rounded-2xl p-6 border-t-4 border-green-500 hover:scale-105 transition-all">
            <span className="text-4xl mb-3 text-green-400">✅</span>
            <div className="text-2xl font-bold text-gray-900">{pendingTasks}</div>
            <p className="text-sm text-gray-500 mt-1">Pending tasks</p>
          </div>
          <div className="flex flex-col bg-white shadow-xl rounded-2xl p-6 border-t-4 border-purple-500 hover:scale-105 transition-all">
            <span className="text-4xl mb-3 text-purple-400">📓</span>
            <div className="text-2xl font-bold text-gray-900">{thisWeekEntries}</div>
            <p className="text-sm text-gray-500 mt-1">Entries this week</p>
          </div>
          <div className="flex flex-col bg-white shadow-xl rounded-2xl p-6 border-t-4 border-yellow-500 hover:scale-105 transition-all">
            <span className="text-4xl mb-3 text-yellow-500">📈</span>
            <div className="text-2xl font-bold text-gray-900">{overallProgress}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall completion</p>
          </div>
        </div>

        {/* CTA Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between min-h-[120px]">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Recent Goals</h3>
            {goals.length === 0
              ? <p className="text-gray-500">
                  No goals yet. <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">Create your first goal!</span>
                </p>
              : (
                <ul className="mt-3 space-y-1 list-inside list-disc">
                  {goals.slice(0, 3).map(goal => (
                    <li key={goal.id} className="text-gray-700">
                      <span className="font-medium text-blue-700">{goal.title}:</span>
                      <span className="ml-1">{goal.progress}% done (target {format(goal.targetDate, 'MMM d')})</span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between min-h-[120px]">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Upcoming Tasks</h3>
            {tasks.length === 0
              ? <p className="text-gray-500">No upcoming tasks. <span className="font-semibold text-green-600">You&apos;re all caught up!</span></p>
              : (
                <ul className="mt-3 space-y-1 list-inside list-disc">
                  {tasks.slice(0, 3).map(task => (
                    <li key={task.id} className="text-gray-700">
                      <span className="font-medium text-green-700">{task.title}</span>
                      <span className="ml-1">({format(task.dueDate, 'MMM d')})</span>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
