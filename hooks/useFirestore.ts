import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Goal, Task, JournalEntry } from '@/types'

// Goals Hook
export const useGoals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        targetDate: doc.data().targetDate?.toDate(),
      })) as Goal[]

      setGoals(goalsData)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const addGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    await addDoc(collection(db, 'goals'), {
      ...goalData,
      userId: user.uid,
      targetDate: Timestamp.fromDate(goalData.targetDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    await updateDoc(doc(db, 'goals', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  }

  const deleteGoal = async (id: string) => {
    await deleteDoc(doc(db, 'goals', id))
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal }
}

// Tasks Hook  
export const useTasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('dueDate', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
        reminderTime: doc.data().reminderTime?.toDate(),
      })) as Task[]

      setTasks(tasksData)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId: user.uid,
      dueDate: Timestamp.fromDate(taskData.dueDate),
      reminderTime: taskData.reminderTime ? Timestamp.fromDate(taskData.reminderTime) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await updateDoc(doc(db, 'tasks', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
  }

  return { tasks, loading, addTask, updateTask, deleteTask }
}

// Journal Hook
export const useJournal = () => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'journal'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as JournalEntry[]

      setEntries(entriesData)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const addEntry = async (entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return

    await addDoc(collection(db, 'journal'), {
      ...entryData,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    await updateDoc(doc(db, 'journal', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  }

  const deleteEntry = async (id: string) => {
    await deleteDoc(doc(db, 'journal', id))
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}