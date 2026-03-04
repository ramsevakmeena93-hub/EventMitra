import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FileText, Star, Users, AlertCircle, CheckCircle, Calendar, MapPin, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FeedbackForm = () => {
  const { eventId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    eventSummary: '',
    successRating: 0,
    attendanceCount: '',
    challenges: '',
    suggestions: '',
    finalReport: ''
  })

  useEffect(() => {
    if (user && user.role !== 'faculty') {
      toast.error('Only faculty can submit feedback')
      navigate('/dashboard')
      return
    }
    
    if (eventId) {
      fetchEvent()
    } else {
      fetchPendingEvents()
    }
  }, [eventId, user, navigate])

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(`/api/events/${eventId}`)
      
      if (data.feedbackSubmitted) {
        toast.error('Feedback already submitted for this event')
        navigate('/dashboard')
        return
      }
      
      if (data.eventStatus !== 'completed') {
        toast.error('Feedback can only be submitted for completed events')
        navigate('/dashboard')
        return
      }
      
      setEvent(data)
    } catch (error) {
      toast.error('Failed to load event details')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingEvents = async () => {
    try {
      const { data } = await axios.get('/api/feedback/pending-events')
      
      if (data.length === 0) {
        toast.error('No pending feedback found')
        navigate('/dashboard')
        return
      }
      
      // Use the first pending event
      setEvent(data[0])
    } catch (error) {
      toast.error('Failed to load pending events')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.successRating === 0) {
      toast.error('Please provide a success rating')
      return
    }

    if (!formData.eventSummary || !formData.finalReport) {
      toast.error('Event summary and final report are required')
      return
    }

    setSubmitting(true)

    try {
      await axios.post(`/api/feedback/${event._id}/submit`, formData)
      
      toast.success('Feedback submitted successfully! You can now book new events.')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Alert Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-xl p-6 mb-8 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-300 mb-2">
              Feedback Required
            </h3>
            <p className="text-amber-800 dark:text-amber-400">
              You must submit feedback for this completed event before you can book new events.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Event Feedback Form
            </h1>
            <p className="text-blue-100 mt-2">Please provide feedback for your completed event</p>
          </div>

          {/* Event Details Card */}
          <div className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-b-2 border-purple-200 dark:border-purple-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Event Title</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.reason}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Venue</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.venueId?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{event.time}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Success Rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Star className="w-5 h-5 text-yellow-500" />
                Event Success Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, successRating: rating })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.successRating >= rating
                        ? 'bg-yellow-500 border-yellow-500 text-white scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 hover:border-yellow-500'
                    }`}
                  >
                    <Star className={`w-8 h-8 ${formData.successRating >= rating ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.successRating === 0 && 'Please rate the event success'}
                {formData.successRating === 1 && 'Poor - Event did not meet expectations'}
                {formData.successRating === 2 && 'Fair - Event had significant issues'}
                {formData.successRating === 3 && 'Good - Event was satisfactory'}
                {formData.successRating === 4 && 'Very Good - Event exceeded expectations'}
                {formData.successRating === 5 && 'Excellent - Event was outstanding'}
              </p>
            </div>

            {/* Event Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.eventSummary}
                onChange={(e) => setFormData({ ...formData, eventSummary: e.target.value })}
                rows="4"
                placeholder="Provide a brief summary of what happened during the event..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Attendance Count */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-5 h-5 text-blue-500" />
                Approximate Attendance Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.attendanceCount}
                onChange={(e) => setFormData({ ...formData, attendanceCount: e.target.value })}
                placeholder="e.g., 150"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Challenges Faced (if any)
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows="3"
                placeholder="Describe any challenges or issues encountered during the event..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggestions for Future Events
              </label>
              <textarea
                value={formData.suggestions}
                onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                rows="3"
                placeholder="Share your suggestions for improving future events..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Final Report */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Final Report <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.finalReport}
                onChange={(e) => setFormData({ ...formData, finalReport: e.target.value })}
                rows="6"
                placeholder="Provide a comprehensive final report including outcomes, achievements, learnings, and overall assessment..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Include details about event outcomes, key achievements, participant feedback, and lessons learned.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 font-bold text-lg shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Submit Feedback
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedbackForm
