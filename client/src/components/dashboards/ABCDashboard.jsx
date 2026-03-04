import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import EventCard from '../EventCard'
import { Clock, CheckCircle, FileText, Edit, Plus, MessageSquare, User, Calendar, MapPin, Users } from 'lucide-react'

const ABCDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [stats, setStats] = useState({})
  const [superAdmins, setSuperAdmins] = useState([])
  const [venues, setVenues] = useState([])
  const [faculty, setFaculty] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [forwardingEvent, setForwardingEvent] = useState(null)
  const [fullEditingEvent, setFullEditingEvent] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchData()
    fetchSuperAdmins()
    fetchVenues()
    fetchFaculty()
    fetchStudents()
    window.addEventListener('eventUpdate', fetchData)
    return () => window.removeEventListener('eventUpdate', fetchData)
  }, [])

  const fetchData = async () => {
    try {
      const [pendingRes, allRes, statsRes] = await Promise.all([
        axios.get('/api/events/pending'),
        axios.get('/api/events/my-events'),
        axios.get('/api/dashboard/stats')
      ])
      setPendingEvents(pendingRes.data)
      setAllEvents(allRes.data)
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuperAdmins = async () => {
    try {
      const { data } = await axios.get('/api/users/superadmins')
      setSuperAdmins(data)
    } catch (error) {
      console.error('Failed to fetch super admins')
    }
  }

  const fetchVenues = async () => {
    try {
      const { data } = await axios.get('/api/venues')
      setVenues(data)
    } catch (error) {
      console.error('Failed to fetch venues')
    }
  }

  const fetchFaculty = async () => {
    try {
      const { data } = await axios.get('/api/users/faculty')
      setFaculty(data)
    } catch (error) {
      console.error('Failed to fetch faculty')
    }
  }

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/api/users/students')
      setStudents(data)
    } catch (error) {
      console.error('Failed to fetch students')
    }
  }

  const handleApprove = async (event, selectedSuperAdminId, comment) => {
    if (!selectedSuperAdminId) {
      toast.error('Please select a Super Admin')
      return
    }

    setActionLoading(true)
    try {
      await axios.post(`/api/events/${event._id}/approve`, { 
        superAdminId: selectedSuperAdminId,
        comment: comment || undefined
      })
      toast.success('Event approved and forwarded to Super Admin!')
      setEditingEvent(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve event')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (event) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    setActionLoading(true)
    try {
      await axios.post(`/api/events/${event._id}/reject`, { reason })
      toast.success('Event rejected')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject event')
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      newDate: new Date(event.date).toISOString().split('T')[0],
      newStartTime: event.startTime || '',
      newEndTime: event.endTime || '',
      newVenueId: event.venueId?._id || ''
    })
  }

  const handleForward = (event) => {
    setForwardingEvent({
      ...event,
      selectedSuperAdmin: '',
      comment: ''
    })
  }

  const handleFullEdit = (event) => {
    setFullEditingEvent({
      ...event,
      newDate: new Date(event.date).toISOString().split('T')[0],
      newStartTime: event.startTime || '',
      newEndTime: event.endTime || '',
      newVenueId: event.venueId?._id || '',
      newFacultyId: event.facultyId?._id || '',
      newStudentId: event.studentId?._id || '',
      newReason: event.reason || ''
    })
  }

  const submitEdit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const updates = {
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      venueId: formData.get('venueId')
    }

    setActionLoading(true)
    try {
      await axios.post(`/api/events/${editingEvent._id}/abc-modify`, updates)
      toast.success('Event updated successfully! Student needs to accept changes.')
      setEditingEvent(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setActionLoading(false)
    }
  }

  const submitForward = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const superAdminId = formData.get('superAdminId')
    const comment = formData.get('comment')
    const giveFinalApproval = formData.get('giveFinalApproval') === 'on'

    // Validate: either give final approval OR select super admin
    if (!giveFinalApproval && !superAdminId) {
      toast.error('Please either check "Give Final Approval" or select a Super Admin')
      return
    }

    setActionLoading(true)
    try {
      await axios.post(`/api/events/${forwardingEvent._id}/approve`, { 
        superAdminId: superAdminId || undefined,
        comment: comment || undefined,
        abcFinalApproval: giveFinalApproval
      })
      
      if (giveFinalApproval) {
        toast.success('Event finally approved by ABC! Ready for key collection.')
      } else {
        toast.success('Event forwarded to Super Admin!')
      }
      
      setForwardingEvent(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process event')
    } finally {
      setActionLoading(false)
    }
  }

  const submitFullEdit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const updates = {
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      venueId: formData.get('venueId'),
      facultyId: formData.get('facultyId'),
      studentId: formData.get('studentId'),
      reason: formData.get('reason'),
      comment: formData.get('comment'),
      superAdminId: formData.get('superAdminId')
    }

    setActionLoading(true)
    try {
      await axios.post(`/api/events/${fullEditingEvent._id}/abc-edit`, updates)
      toast.success('Event fully updated and forwarded to Super Admin!')
      setFullEditingEvent(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const eventData = {
      studentId: formData.get('studentId'),
      facultyId: formData.get('facultyId'),
      venueId: formData.get('venueId'),
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      reason: formData.get('reason'),
      createdByABC: true
    }

    setActionLoading(true)
    try {
      await axios.post('/api/events/abc-create', eventData)
      toast.success('Event created successfully!')
      setShowCreateForm(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    } finally {
      setActionLoading(false)
    }
  }

  const actionButtons = [
    {
      label: 'Edit Time/Venue',
      action: 'edit',
      className: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      label: 'Forward',
      action: 'forward',
      className: 'bg-green-600 text-white hover:bg-green-700'
    },
    {
      label: 'Full Edit',
      action: 'fullEdit',
      className: 'bg-purple-600 text-white hover:bg-purple-700'
    },
    {
      label: 'Reject',
      action: 'reject',
      className: 'bg-red-600 text-white hover:bg-red-700'
    }
  ]

  const handleAction = (action, event) => {
    if (action === 'edit') {
      handleEdit(event)
    } else if (action === 'forward') {
      handleForward(event)
    } else if (action === 'fullEdit') {
      handleFullEdit(event)
    } else if (action === 'reject') {
      handleReject(event)
    }
  }

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour
      slots.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${displayHour}:00 ${period}`
      })
      if (hour < 18) {
        slots.push({
          value: `${hour.toString().padStart(2, '0')}:30`,
          label: `${displayHour}:30 ${period}`
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ABC Dashboard - Full Admin Control
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals || 0}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Modifications</p>
              <p className="text-2xl font-bold text-purple-600">{stats.pendingModifications || 0}</p>
            </div>
            <Edit className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents || 0}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-600" />
            Create New Event (ABC Admin)
          </h2>
          <form onSubmit={handleCreateEvent} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Select Student
              </label>
              <select
                name="studentId"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose student</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} - {student.enrollmentNo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Select Faculty
              </label>
              <select
                name="facultyId"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose faculty</option>
                {faculty.map(fac => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name} - {fac.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Select Venue
              </label>
              <select
                name="venueId"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose venue</option>
                {venues.map(venue => (
                  <option key={venue._id} value={venue._id}>
                    {venue.building} - {venue.room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <select
                name="startTime"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select start time</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <select
                name="endTime"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select end time</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter reason for event..."
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Time/Venue Form (Simple Edit) */}
      {editingEvent && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-600" />
            Edit Time & Venue Only
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Modify venue, date, and time. Student will need to accept changes.
          </p>
          <form onSubmit={submitEdit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Venue
              </label>
              <select
                name="venueId"
                defaultValue={editingEvent.newVenueId}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {venues.map(venue => (
                  <option key={venue._id} value={venue._id}>
                    {venue.building} - {venue.room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={editingEvent.newDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <select
                name="startTime"
                defaultValue={editingEvent.newStartTime}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <select
                name="endTime"
                defaultValue={editingEvent.newEndTime}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Forward to Super Admin Form */}
      {forwardingEvent && (
        <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border-2 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            ABC Approval - Ultimate Authority
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            As ABC, you have ultimate authority. You can give final approval directly OR forward to Super Admin.
          </p>
          <form onSubmit={submitForward} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                ABC Comment (Optional)
              </label>
              <textarea
                name="comment"
                rows="3"
                placeholder="Add your comments or notes about this booking..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="giveFinalApproval"
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  onChange={(e) => {
                    const superAdminSelect = e.target.form.querySelector('select[name="superAdminId"]');
                    if (superAdminSelect) {
                      superAdminSelect.disabled = e.target.checked;
                      superAdminSelect.required = !e.target.checked;
                      if (e.target.checked) {
                        superAdminSelect.value = '';
                      }
                    }
                  }}
                />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ✓ Give Final Approval (ABC Authority)
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check this to approve directly. Event will be ready for key collection. No Super Admin needed.
                  </p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OR Select Super Admin to Forward
              </label>
              <select
                name="superAdminId"
                className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose Super Admin (Dean/Principal/Director)</option>
                {superAdmins.map(admin => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} - {admin.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty if giving final approval yourself
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve & Process
              </button>
              <button
                type="button"
                onClick={() => setForwardingEvent(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Full Edit Form (Edit Everything) */}
      {fullEditingEvent && (
        <div className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Edit className="w-6 h-6 text-purple-600" />
            Full Edit - Change Everything
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Modify all details including student, faculty, and reason. Forward to Super Admin after editing.
          </p>
          <form onSubmit={submitFullEdit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Student
              </label>
              <select
                name="studentId"
                defaultValue={fullEditingEvent.newStudentId}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} - {student.enrollmentNo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Faculty
              </label>
              <select
                name="facultyId"
                defaultValue={fullEditingEvent.newFacultyId}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {faculty.map(fac => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name} - {fac.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Venue
              </label>
              <select
                name="venueId"
                defaultValue={fullEditingEvent.newVenueId}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {venues.map(venue => (
                  <option key={venue._id} value={venue._id}>
                    {venue.building} - {venue.room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={fullEditingEvent.newDate}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <select
                name="startTime"
                defaultValue={fullEditingEvent.newStartTime}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <select
                name="endTime"
                defaultValue={fullEditingEvent.newEndTime}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                defaultValue={fullEditingEvent.newReason}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                ABC Comment (Optional)
              </label>
              <textarea
                name="comment"
                rows="3"
                placeholder="Add your comments or notes about this booking..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <span className="text-red-500">*</span> Select Super Admin
              </label>
              <select
                name="superAdminId"
                required
                className="w-full px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose Super Admin (Dean/Registrar)</option>
                {superAdmins.map(admin => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} - {admin.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                Save All & Forward to Super Admin
              </button>
              <button
                type="button"
                onClick={() => setFullEditingEvent(null)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Approvals */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Pending Approvals
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pendingEvents.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No pending approvals</p>
          ) : (
            pendingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                showActions={!actionLoading}
                actionButtons={actionButtons}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      </div>

      {/* All Events */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          All Events
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {allEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ABCDashboard
