'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import Dashboard from '@/components/Dashboard'
import Sidebar from '@/components/Sidebar'
import GoalsPage from '@/components/Goals/GoalsPage'
import TasksPage from '@/components/Tasks/TasksPage'
import JournalPage from '@/components/Journal/JournalPage'
import { useState } from 'react'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'goals':
        return <GoalsPage />
      case 'tasks':
        return <TasksPage />
      case 'journal':
        return <JournalPage />
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>
      default:
        return <Dashboard />
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </ProtectedRoute>
  )
}