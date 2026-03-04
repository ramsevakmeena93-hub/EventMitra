import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import EventCard from '../EventCard'
import BookingTracker from '../BookingTracker'
import { FileText, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

const StudentDashboard = () => {
  const [allEvents, setAllEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [stats, setStats] = useState({})
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('my') // 'my' or 'all'

  useEffect(() => {
    fetchData()
    window.addEventListener('eventUpdate', fetchData)
    return () => window.removeEventListener('eventUpdate', fetchData)
  }, [])

  const fetchData = async () => {
    try {
      const [myEventsRes, allEventsRes, statsRes] = await Promise.all([
        axios.get('/api/events/my-events'),
        axios.get('/api/events/all'),
        axios.get('/api/dashboard/stats')
      ])
      setMyEvents(myEventsRes.data)
      setAllEvents(allEventsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptModification = async (event) => {
    try {
      await axios.post(`/api/events/${event._id}/accept-modification`)
      toast.success('Modifications accepted!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept modifications')
    }
  }

  const getActionButtons = (event, isMyEvent) => {
    if (isMyEvent && event.status === 'modification_pending') {
      return [
        {
          label: 'Accept Changes',
          action: 'accept',
          className: 'bg-green-600 text-white hover:bg-green-700'
        },
        {
          label: 'Track Status',
          action: 'view',
          className: 'bg-blue-600 text-white hover:bg-blue-700'
        }
      ]
    }
    return [
      {
        label: 'View Details',
        action: 'view',
        className: 'bg-blue-600 text-white hover:bg-blue-700'
      }
    ]
  }

  const handleAction = (action, event) => {
    if (action === 'accept') {
      handleAcceptModification(event)
    } else if (action === 'view') {
      setSelectedEvent(event)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const eventsToShow = viewMode === 'my' ? myEvents : allEvents

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View all college events and track your bookings
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">My Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myEvents.length || 0}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">All Events</p>
              <p className="text-2xl font-bold text-purple-600">{allEvents.length || 0}</p>
            </div>
            <Eye className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setViewMode('my')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            viewMode === 'my'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          My Events ({myEvents.length})
        </button>
        <button
          onClick={() => setViewMode('all')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            viewMode === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All College Events ({allEvents.length})
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {viewMode === 'my' ? 'My Events' : 'All College Events'}
          </h2>
          <div className="space-y-4">
            {eventsToShow.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {viewMode === 'my' ? 'No events found for you' : 'No events found in the college'}
                </p>
              </div>
            ) : (
              eventsToShow.map((event) => {
                const isMyEvent = myEvents.some(e => e._id === event._id)
                return (
                  <div key={event._id} className="space-y-2">
                    <EventCard
                      event={event}
                      showActions={true}
                      actionButtons={getActionButtons(event, isMyEvent)}
                      onAction={handleAction}
                    />
                    {/* Key Status Badge - only for my events */}
                    {isMyEvent && event.status === 'approved' && event.keyStatus && event.keyStatus !== 'not_required' && (
                      <div className={`p-3 rounded-lg border-2 ${
                        event.keyStatus === 'pending_collection' ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700' :
                        event.keyStatus === 'collected' ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700' :
                        'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          {event.keyStatus === 'pending_collection' && (
                            <>
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <div>
                                <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                                  🔑 Collect Key from Registrar Office
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                  Your booking is approved. Please collect the key before your event.
                                </p>
                              </div>
                            </>
                          )}
                          {event.keyStatus === 'collected' && (
                            <>
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-semibold text-blue-800 dark:text-blue-300">
                                  🔑 Key Collected
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                  Please return the key after your event.
                                </p>
                                {event.keyCollectedAt && (
                                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                                    Collected: {new Date(event.keyCollectedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                          {event.keyStatus === 'returned' && (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="font-semibold text-green-800 dark:text-green-300">
                                  ✅ Key Returned - Booking Complete
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                  Thank you for returning the key on time!
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {selectedEvent && (
          <div className="sticky top-8">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Event Details & Tracker
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
            <BookingTracker event={selectedEvent} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDashboard
