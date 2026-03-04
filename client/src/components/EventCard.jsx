import { Calendar, Clock, MapPin, User } from 'lucide-react'

const EventCard = ({ event, onAction, showActions = false, actionButtons = [] }) => {
  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      pending_faculty: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pending_hod: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pending_abc: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pending_superadmin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      modification_pending: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {event.studentId?.name || event.studentName}
          </h3>
          {event.studentId?.enrollmentNo && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {event.studentId.enrollmentNo}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
          {event.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <MapPin size={16} />
          <span className="text-sm">
            {event.venueId?.building} - {event.venueId?.room}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Calendar size={16} />
          <span className="text-sm">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <Clock size={16} />
          <span className="text-sm">{event.time}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Reason:</span> {event.reason}
        </p>
      </div>

      {event.rejectionReason && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">
            <span className="font-medium">Rejection Reason:</span> {event.rejectionReason}
          </p>
        </div>
      )}

      {showActions && actionButtons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => onAction(button.action, event)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventCard
