import { CheckCircle, XCircle, Clock, User } from 'lucide-react'

const EventTimeline = ({ history, status }) => {
  const getIcon = (action) => {
    switch (action) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'modified':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <User className="w-5 h-5 text-blue-500" />
    }
  }

  const getRoleLabel = (role) => {
    const labels = {
      student: 'Student',
      faculty: 'Faculty',
      hod: 'HOD',
      abc: 'ABC',
      superadmin: 'Super Admin'
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Approval Timeline
      </h3>
      <div className="relative">
        {history.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 mt-1">
              {getIcon(item.action)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {getRoleLabel(item.role)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.action}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.userName}
              </p>
              {item.reason && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Reason: {item.reason}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
          Current Status: <span className="uppercase">{status.replace('_', ' ')}</span>
        </p>
      </div>
    </div>
  )
}

export default EventTimeline
