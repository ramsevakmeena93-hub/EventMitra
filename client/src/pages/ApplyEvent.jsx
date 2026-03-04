import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Calendar, Clock, MapPin, FileText, User, Users, Upload, Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ApplyEvent = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    clubId: '',
    venueId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    eventDetails: ''
  })
  
  const [document, setDocument] = useState(null)
  const [venues, setVenues] = useState([])
  const [selectedHOD, setSelectedHOD] = useState(null)
  const [userClub, setUserClub] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [venuesLoading, setVenuesLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== 'faculty') {
      toast.error('Only faculty can create events')
      navigate('/dashboard')
    }
  }, [user, navigate])

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

  useEffect(() => {
    console.log('[ApplyEvent] Component mounted')
    fetchVenues()
    fetchUserClub()
  }, [])

  const fetchUserClub = async () => {
    try {
      const { data } = await axios.get('/api/users/my-club')
      console.log('[fetchUserClub] Response:', data)
      if (data.club) {
        setUserClub(data.club)
        setFormData(prev => ({ ...prev, clubId: data.club._id }))
      }
    } catch (error) {
      console.log('[fetchUserClub] No club assigned')
    }
  }

  const fetchVenues = async () => {
    try {
      console.log('[fetchVenues] Starting API call...')
      setVenuesLoading(true)
      
      const response = await axios.get('/api/venues')
      console.log('[fetchVenues] Full response:', response)
      console.log('[fetchVenues] Response data:', response.data)
      console.log('[fetchVenues] Data type:', typeof response.data)
      console.log('[fetchVenues] Is array:', Array.isArray(response.data))
      console.log('[fetchVenues] Length:', response.data?.length)
      
      if (!response.data) {
        console.error('[fetchVenues] No data in response')
        toast.error('No venue data received from server')
        setVenues([])
        return
      }
      
      if (!Array.isArray(response.data)) {
        console.error('[fetchVenues] Data is not an array:', response.data)
        toast.error('Invalid venue data format')
        setVenues([])
        return
      }
      
      if (response.data.length === 0) {
        console.warn('[fetchVenues] Empty venues array')
        toast.error('No venues available in the system')
        setVenues([])
        return
      }
      
      // Log first few venues
      console.log('[fetchVenues] First 3 venues:')
      response.data.slice(0, 3).forEach((v, i) => {
        console.log(`  ${i + 1}. Name: "${v.name}" | ID: ${v._id}`)
      })
      
      setVenues(response.data)
      console.log('[fetchVenues] SUCCESS - Set', response.data.length, 'venues to state')
      toast.success(`Loaded ${response.data.length} venues`)
      
    } catch (error) {
      console.error('[fetchVenues] ERROR:', error)
      console.error('[fetchVenues] Error response:', error.response)
      console.error('[fetchVenues] Error message:', error.message)
      
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error'
      toast.error(`Failed to load venues: ${errorMsg}`)
      setVenues([])
    } finally {
      setVenuesLoading(false)
    }
  }

  const handleVenueChange = async (e) => {
    const venueId = e.target.value
    console.log('[handleVenueChange] Selected venue ID:', venueId)
    setFormData({ ...formData, venueId })
    
    if (venueId) {
      try {
        const venue = venues.find(v => v._id === venueId)
        console.log('[handleVenueChange] Found venue:', venue)
        
        // Only fetch HOD if venue name contains "Seminar Hall"
        if (venue && venue.name && venue.name.includes('Seminar Hall') && venue.hodDepartment) {
          console.log('[handleVenueChange] Fetching HOD for department:', venue.hodDepartment)
          const { data } = await axios.get(`/api/users/hod/${venue.hodDepartment}`)
          console.log('[handleVenueChange] HOD data:', data)
          setSelectedHOD(data)
        } else {
          console.log('[handleVenueChange] Not a Seminar Hall, no HOD needed')
          setSelectedHOD(null)
        }
      } catch (error) {
        console.error('[handleVenueChange] Error:', error)
        setSelectedHOD(null)
      }
    } else {
      setSelectedHOD(null)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        e.target.value = ''
        return
      }
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, DOCX, JPG, PNG files are allowed')
        e.target.value = ''
        return
      }
      
      setDocument(file)
    }
  }

  const validateTimeRange = () => {
    if (!formData.startTime || !formData.endTime) return true
    
    const [startHour, startMin] = formData.startTime.split(':').map(Number)
    const [endHour, endMin] = formData.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    if (endMinutes <= startMinutes) {
      toast.error('End time must be after start time')
      return false
    }
    
    if (endHour > 18 || (endHour === 18 && endMin > 0)) {
      toast.error('Bookings cannot extend beyond 6:00 PM')
      return false
    }
    
    return true
  }

  const checkAvailability = async () => {
    if (!formData.venueId || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please select venue, date, start time, and end time first')
      return
    }

    if (!validateTimeRange()) {
      return
    }

    setChecking(true)
    try {
      const { data } = await axios.post('/api/events/check-availability', {
        venueId: formData.venueId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      })

      if (data.available) {
        toast.success('Venue is available!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to check availability')
    } finally {
      setChecking(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!document) {
      toast.error('Please upload a document (required)')
      return
    }

    if (!validateTimeRange()) {
      return
    }

    setLoading(true)

    try {
      const availCheck = await axios.post('/api/events/check-availability', {
        venueId: formData.venueId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime
      })

      if (!availCheck.data.available) {
        toast.error(availCheck.data.message)
        setLoading(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append('clubId', formData.clubId)
      formDataToSend.append('venueId', formData.venueId)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('startTime', formData.startTime)
      formDataToSend.append('endTime', formData.endTime)
      formDataToSend.append('reason', formData.reason)
      formDataToSend.append('eventDetails', formData.eventDetails)
      formDataToSend.append('document', document)

      await axios.post('/api/events/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success('Event application submitted successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  // Debug: Log venues state whenever it changes
  useEffect(() => {
    console.log('[venues state changed] Current venues:', venues)
    console.log('[venues state changed] Length:', venues.length)
  }, [venues])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Apply for Event</h1>
            <p className="text-blue-100 mt-2">Faculty Event Booking System</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Faculty Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Faculty Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Faculty Name</label>
                  <input type="text" value={user?.name || ''} disabled className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-200 cursor-not-allowed" />
                </div>
                
                {userClub && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Users className="inline w-5 h-5 mr-2 text-pink-600" />
                      Club (Auto-assigned)
                    </label>
                    <input 
                      type="text" 
                      value={userClub.name} 
                      disabled 
                      className="w-full px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-300 dark:border-pink-700 rounded-lg text-gray-700 dark:text-gray-200 cursor-not-allowed font-medium" 
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      You are a coordinator of this club. Events will be created for this club.
                    </p>
                  </div>
                )}
                
                {!userClub && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      ⚠️ You are not assigned to any club. Events will be created as general events.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Venue Selection */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={18} className="text-green-600" />
                  <span>Select Venue <span className="text-red-500">*</span></span>
                </label>
                
                {venuesLoading ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    Loading venues...
                  </div>
                ) : venues.length === 0 ? (
                  <div className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    ⚠️ No venues available. Please contact administrator.
                  </div>
                ) : (
                  <select 
                    required 
                    value={formData.venueId} 
                    onChange={handleVenueChange} 
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">Choose a venue ({venues.length} available)</option>
                    {venues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.name || `Venue ${venue._id}`}
                      </option>
                    ))}
                  </select>
                )}
                
                {/* Debug info - remove in production */}
                <p className="mt-1 text-xs text-gray-500">
                  Debug: {venues.length} venues loaded
                </p>
              </div>

              {/* HOD Section - Only shows for Seminar Halls */}
              {selectedHOD && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 size={18} className="text-green-600" />
                    <span>HOD (Auto-assigned)</span>
                  </label>
                  <input type="text" value={`${selectedHOD.name} - ${selectedHOD.department}`} disabled className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-not-allowed" />
                </div>
              )}
            </div>

            {/* Date and Time Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span>Event Date <span className="text-red-500">*</span></span>
                </label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock size={18} className="text-purple-600" />
                    <span>Start Time <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all">
                    <option value="">Select start time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock size={18} className="text-pink-600" />
                    <span>End Time <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white transition-all">
                    <option value="">Select end time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">⚠️ Bookings are only allowed from 8:00 AM to 6:00 PM</p>
            </div>

            {/* Check Availability Button */}
            <button type="button" onClick={checkAvailability} disabled={checking} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 font-medium shadow-lg transition-all transform hover:scale-105">
              {checking ? 'Checking...' : '✓ Check Venue Availability'}
            </button>

            {/* Event Details */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={18} className="text-indigo-600" />
                <span>Event Title/Reason <span className="text-red-500">*</span></span>
              </label>
              <input type="text" required value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="e.g., Technical Workshop on AI/ML" className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all" />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={18} className="text-blue-600" />
                <span>Event Details <span className="text-red-500">*</span></span>
              </label>
              <textarea required value={formData.eventDetails} onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })} rows="5" placeholder="Describe the event purpose, agenda, expected participants, learning outcomes, etc..." className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all" />
            </div>

            {/* Document Upload */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-700">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Upload size={18} className="text-orange-600" />
                <span>Upload Document <span className="text-red-500">*</span></span>
              </label>
              <input type="file" required onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="w-full px-4 py-3 border-2 border-orange-300 dark:border-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 dark:file:bg-orange-900 dark:file:text-orange-200 transition-all" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">📄 Upload event proposal, permission letter, or related document</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">Supported: PDF, DOC, DOCX, JPG, PNG • Max size: 5MB</p>
              {document && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">✓ Selected: {document.name}</p>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading || venuesLoading || venues.length === 0} className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 font-bold text-lg shadow-xl transition-all transform hover:scale-105">
              {loading ? 'Submitting Application...' : '🚀 Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplyEvent
