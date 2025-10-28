'use client'
import { useState } from 'react'
import { useJournal } from '@/hooks/useFirestore'
import { JournalEntry } from '@/types'
import { Plus, Edit, Trash2, BookOpen, Search, Calendar, Tag } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function JournalPage() {
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useJournal()
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const moods = ['great', 'good', 'okay', 'bad', 'terrible']

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const tags = (formData.get('tags') as string)
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const entryData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tags,
      mood: formData.get('mood') as JournalEntry['mood'],
      isPrivate: formData.get('isPrivate') === 'on',
    }

    setShowModal(false)
    setEditingEntry(null)

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, entryData)
        toast.success('Entry updated successfully!')
      } else {
        await addEntry(entryData)
        toast.success('Entry created successfully!')
      }
      form.reset()
    } catch (error) {
      toast.error('Failed to save entry')
      setShowModal(true)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteEntry(id)
        toast.success('Entry deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete entry')
      }
    }
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowModal(true)
  }

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'great': return '😄'
      case 'good': return '😊'
      case 'okay': return '😐'
      case 'bad': return '😞'
      case 'terrible': return '😢'
      default: return '📝'
    }
  }

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'great': return 'bg-green-100 border-green-300'
      case 'good': return 'bg-blue-100 border-blue-300'
      case 'okay': return 'bg-yellow-100 border-yellow-300'
      case 'bad': return 'bg-orange-100 border-orange-300'
      case 'terrible': return 'bg-red-100 border-red-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your journal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-purple-600" />
              Journal
            </h1>
            <p className="text-gray-600 mt-2">Your private thoughts and reflections</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Entries */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <BookOpen className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchTerm ? 'No matching entries' : 'No journal entries yet'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or create a new entry.' 
                : 'Start documenting your journey by creating your first journal entry.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 btn btn-primary"
              >
                Create First Entry
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <div 
                key={entry.id} 
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${getMoodColor(entry.mood)}`}
              >
                <div className="p-6">
                  {/* Entry Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`text-4xl p-3 rounded-xl ${getMoodColor(entry.mood)}`}>
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{entry.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(entry.createdAt, 'MMMM d, yyyy')}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{format(entry.createdAt, 'h:mm a')}</span>
                          {entry.isPrivate && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1 text-purple-600 font-medium">
                                🔒 Private
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit entry"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Entry Content */}
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      <Tag className="w-4 h-4 text-gray-400 mt-1" />
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                  {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingEntry?.title}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      placeholder="Give your entry a memorable title..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      rows={12}
                      required
                      defaultValue={editingEntry?.content}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      placeholder="Pour your thoughts here..."
                    />
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How are you feeling?
                    </label>
                    <select
                      name="mood"
                      defaultValue={editingEntry?.mood || ''}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="">Select your mood (optional)</option>
                      {moods.map(mood => (
                        <option key={mood} value={mood}>
                          {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingEntry?.tags.join(', ')}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      placeholder="work, personal, reflection, growth (comma-separated)"
                    />
                  </div>

                  {/* Privacy Toggle */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPrivate"
                        id="isPrivate"
                        defaultChecked={editingEntry?.isPrivate !== false}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        🔒 Keep this entry private
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-8">
                      Private entries are only visible to you
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingEntry(null)
                    }}
                    className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
