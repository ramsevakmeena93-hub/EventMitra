import { CheckCircle, Circle, XCircle, Clock, User, UserCheck, Building2, Shield, Crown } from 'lucide-react'

const BookingTracker = ({ event }) => {
  // Define all stages in the approval workflow
  const stages = [
    { 
      key: 'submitted', 
      label: 'Submitted', 
      icon: User,
      description: 'Application submitted by student'
    },
    { 
      key: 'faculty', 
      label: 'Faculty Review', 
      icon: UserCheck,
      description: 'Pending faculty approval'
    },
    { 
      key: 'hod', 
      label: 'HOD Review', 
      icon: Building2,
      description: 'Pending HOD approval'
    },
    { 
      key: 'abc', 
      label: 'ABC Review', 
      icon: Shield,
      description: 'Pending ABC approval'
    },
    { 
      key: 'superadmin', 
      label: 'Final Approval', 
      icon: Crown,
      description: 'Pending super admin approval'
    },
    { 
      key: 'confirmed', 
      label: 'Confirmed', 
      icon: CheckCircle,
      description: 'Booking confirmed'
    }
  ]

  // Determine current stage based on event status
  const getCurrentStageIndex = () => {
    if (event.status === 'rejected') return -1
    if (event.status === 'approved') return 5
    if (event.status === 'pending_superadmin') return 4
    if (event.status === 'pending_abc') return 3
    if (event.status === 'pending_hod') return 2
    if (event.status === 'pending_faculty') return 1
    return 0
  }

  const currentStageIndex = getCurrentStageIndex()
  const isRejected = event.status === 'rejected'

  // Get stage status
  const getStageStatus = (index) => {
    if (isRejected && index === currentStageIndex + 1) return 'rejected'
    if (index < currentStageIndex) return 'completed'
    if (index === currentStageIndex) return 'current'
    return 'pending'
  }

  // Get colors based on status - Enhanced vibrant colors
  const getStatusColors = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          border: 'border-emerald-500',
          text: 'text-emerald-600 dark:text-emerald-400',
          icon: 'text-white',
          glow: 'shadow-lg shadow-emerald-500/50'
        }
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          border: 'border-blue-500',
          text: 'text-blue-600 dark:text-blue-400',
          icon: 'text-white',
          glow: 'shadow-xl shadow-blue-500/50'
        }
      case 'rejected':
        return {
          bg: 'bg-gradient-to-br from-red-500 to-rose-600',
          border: 'border-red-500',
          text: 'text-red-600 dark:text-red-400',
          icon: 'text-white',
          glow: 'shadow-lg shadow-red-500/50'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700',
          border: 'border-gray-300 dark:border-gray-600',
          text: 'text-gray-500 dark:text-gray-400',
          icon: 'text-gray-500 dark:text-gray-400',
          glow: ''
        }
    }
  }

  // Get timestamp for each stage from history
  const getStageTimestamp = (stageKey) => {
    if (!event.history) return null
    
    const historyMap = {
      'submitted': 'submitted',
      'faculty': 'approved',
      'hod': 'approved',
      'abc': 'approved',
      'superadmin': 'approved',
      'confirmed': 'approved'
    }

    const roleMap = {
      'submitted': 'student',
      'faculty': 'faculty',
      'hod': 'hod',
      'abc': 'abc',
      'superadmin': 'superadmin',
      'confirmed': 'superadmin'
    }

    const historyItem = event.history.find(
      h => h.action === historyMap[stageKey] && h.role === roleMap[stageKey]
    )

    return historyItem?.timestamp
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Booking Status Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Track your booking approval progress in real-time
        </p>
      </div>

      {/* Rejection Alert */}
      {isRejected && (
        <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 rounded-xl shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
              <XCircle className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
                Booking Rejected
              </h3>
              {event.rejectionReason && (
                <p className="text-sm text-red-700 dark:text-red-400 bg-white/50 dark:bg-black/20 rounded-lg p-3">
                  <strong>Reason:</strong> {event.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative mb-12">
        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const status = getStageStatus(index)
              const colors = getStatusColors(status)
              const Icon = stage.icon
              const timestamp = getStageTimestamp(stage.key)
              const isLast = index === stages.length - 1

              return (
                <div key={stage.key} className="flex items-center flex-1">
                  {/* Stage Circle */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-16 h-16 rounded-full ${colors.bg} ${colors.border} border-4 flex items-center justify-center ${colors.glow} transform transition-all duration-300 ${
                        status === 'current' ? 'scale-110 animate-pulse' : ''
                      }`}
                    >
                      {status === 'rejected' ? (
                        <XCircle className={`w-8 h-8 ${colors.icon}`} />
                      ) : status === 'completed' ? (
                        <CheckCircle className={`w-8 h-8 ${colors.icon}`} />
                      ) : status === 'current' ? (
                        <Clock className={`w-8 h-8 ${colors.icon} animate-spin-slow`} />
                      ) : (
                        <Icon className={`w-8 h-8 ${colors.icon}`} />
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <p className={`text-sm font-semibold ${colors.text}`}>
                        {stage.label}
                      </p>
                      {timestamp && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div className="flex-1 h-2 mx-2 relative">
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div
                        className={`absolute inset-0 ${
                          status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        } rounded-full transition-all duration-500`}
                        style={{
                          width: status === 'completed' ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(index)
            const colors = getStatusColors(status)
            const Icon = stage.icon
            const timestamp = getStageTimestamp(stage.key)
            const isLast = index === stages.length - 1

            return (
              <div key={stage.key} className="relative">
                <div className="flex items-start">
                  {/* Stage Circle */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full ${colors.bg} ${colors.border} border-4 flex items-center justify-center ${colors.glow} ${
                        status === 'current' ? 'animate-pulse' : ''
                      }`}
                    >
                      {status === 'rejected' ? (
                        <XCircle className={`w-6 h-6 ${colors.icon}`} />
                      ) : status === 'completed' ? (
                        <CheckCircle className={`w-6 h-6 ${colors.icon}`} />
                      ) : status === 'current' ? (
                        <Clock className={`w-6 h-6 ${colors.icon}`} />
                      ) : (
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      )}
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="ml-4 flex-1">
                    <p className={`text-base font-semibold ${colors.text}`}>
                      {stage.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stage.description}
                    </p>
                    {timestamp && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="ml-6 mt-2 mb-2">
                    <div
                      className={`w-1 h-8 rounded-full ${
                        status === 'completed' ? 'bg-gradient-to-b from-emerald-500 to-green-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Status</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:text-white">
              {isRejected ? 'Rejected' : stages[currentStageIndex]?.label || 'Processing'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Progress</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:text-white">
              {isRejected ? '0%' : `${Math.round((currentStageIndex / (stages.length - 1)) * 100)}%`}
            </p>
          </div>
        </div>
        <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full ${isRejected ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600'} transition-all duration-500 shadow-lg`}
            style={{
              width: isRejected ? '0%' : `${(currentStageIndex / (stages.length - 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default BookingTracker
