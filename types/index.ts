export interface User {
  id: string
  email: string
  displayName: string
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  userId: string
  title: string
  description: string
  category: 'Personal' | 'Professional' | 'Health' | 'Learning' | 'Finance' | 'Relationships'
  targetDate: Date
  progress: number
  status: 'not-started' | 'in-progress' | 'completed' | 'paused'
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  reminder: boolean
  reminderTime?: Date
  goalId?: string
  createdAt: Date
  updatedAt: Date
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  tags: string[]
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible'
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}