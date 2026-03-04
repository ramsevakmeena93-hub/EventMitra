import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Users, Plus, Edit, Trash2, Phone, Mail, Search, X } from 'lucide-react'

const Clubs = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clubs, setClubs] = useState([])
  const [filteredClubs, setFilteredClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClub, setSelectedClub] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinators: [{ name: '', email: '', mobile: '' }]
  })

  const isABC = user?.role === 'abc'
  const isSuperAdmin = user?.role === 'superadmin'
  const canManage = isABC // Only ABC can add/edit/delete

  // Restrict access to ABC and Super Admin only
  useEffect(() => {
    if (user && user.role !== 'abc' && user.role !== 'superadmin') {
      toast.error('Access denied. Only ABC and Super Admin can view clubs.')
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    fetchClubs()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.coordinators.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredClubs(filtered)
    } else {
      setFilteredClubs(clubs)
    }
  }, [searchTerm, clubs])

  const fetchClubs = async () => {
    try {
      const { data } = await axios.get('/api/clubs')
      setClubs(data)
      setFilteredClubs(data)
    } catch (error) {
      toast.error('Failed to fetch clubs')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCoordinator = () => {
    setFormData({
      ...formData,
      coordinators: [...formData.coordinators, { name: '', email: '', mobile: '' }]
    })
  }

  const handleRemoveCoordinator = (index) => {
    const newCoordinators = formData.coordinators.filter((_, i) => i !== index)
    setFormData({ ...formData, coordinators: newCoordinators })
  }

  const handleCoordinatorChange = (index, field, value) => {
    const newCoordinators = [...formData.coordinators]
    newCoordinators[index][field] = value
    setFormData({ ...formData, coordinators: newCoordinators })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedClub) {
        await axios.put(`/api/clubs/${selectedClub._id}`, formData)
        toast.success('Club updated successfully!')
      } else {
        await axios.post('/api/clubs/create', formData)
        toast.success('Club created successfully!')
      }
      setShowAddModal(false)
      setShowEditModal(false)
      setFormData({ name: '', description: '', coordinators: [{ name: '', email: '', mobile: '' }] })
      setSelectedClub(null)
      fetchClubs()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (club) => {
    setSelectedClub(club)
    setFormData({
      name: club.name,
      description: club.description || '',
      coordinators: club.coordinators
    })
    setShowEditModal(true)
  }

  const handleDelete = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return
    
    try {
      await axios.delete(`/api/clubs/${clubId}`)
      toast.success('Club deleted successfully!')
      fetchClubs()
    } catch (error) {
      toast.error('Failed to delete club')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                MITS Clubs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {clubs.length} clubs registered at MITS Gwalior
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Club
              </button>
            )}
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clubs or coordinators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {club.name}
                </h3>
                {canManage && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(club)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(club._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {club.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {club.description}
                </p>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Faculty Coordinators:
                </p>
                {club.coordinators.map((coord, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {coord.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${coord.email}`} className="hover:text-blue-600">
                        {coord.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${coord.mobile}`} className="hover:text-blue-600">
                        {coord.mobile}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm ? 'No clubs found matching your search' : 'No clubs available'}
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedClub ? 'Edit Club' : 'Add New Club'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedClub(null)
                      setFormData({ name: '', description: '', coordinators: [{ name: '', email: '', mobile: '' }] })
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Club Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Robotics Club"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Brief description of the club"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Faculty Coordinators *
                      </label>
                      <button
                        type="button"
                        onClick={handleAddCoordinator}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Coordinator
                      </button>
                    </div>

                    {formData.coordinators.map((coord, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Coordinator {index + 1}
                          </span>
                          {formData.coordinators.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCoordinator(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            required
                            value={coord.name}
                            onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                            placeholder="Name"
                          />
                          <input
                            type="email"
                            required
                            value={coord.email}
                            onChange={(e) => handleCoordinatorChange(index, 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            required
                            value={coord.mobile}
                            onChange={(e) => handleCoordinatorChange(index, 'mobile', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                            placeholder="Mobile"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {selectedClub ? 'Update Club' : 'Create Club'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setShowEditModal(false)
                        setSelectedClub(null)
                        setFormData({ name: '', description: '', coordinators: [{ name: '', email: '', mobile: '' }] })
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clubs
