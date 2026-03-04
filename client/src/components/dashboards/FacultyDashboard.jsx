import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import EventCard from '../EventCard'
import { Clock, CheckCircle, FileText } from 'lucide-react'

const FacultyDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchData()
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

  const handleApprove = async (event) => {
    setActionLoading(true)
    try {
      await axios.post(`/api/events/${event._id}/approve`)
      toast.success('Event approved successfully!')
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

  const actionButtons = [
    {
      label: 'Approve',
      action: 'approve',
      className: 'bg-green-600 text-white hover:bg-green-700'
    },
    {
      label: 'Reject',
      action: 'reject',
      className: 'bg-red-600 text-white hover:bg-red-700'
    }
  ]

  const handleAction = (action, event) => {
    if (action === 'approve') {
      handleApprove(event)
    } else if (action === 'reject') {
      handleReject(event)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Faculty Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
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

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          All My Events
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

export default FacultyDashboard
