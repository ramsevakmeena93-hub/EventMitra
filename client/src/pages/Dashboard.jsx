import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import StudentDashboard from '../components/dashboards/StudentDashboard'
import FacultyDashboard from '../components/dashboards/FacultyDashboard'
import HODDashboard from '../components/dashboards/HODDashboard'
import ABCDashboard from '../components/dashboards/ABCDashboard'
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard'
import RegistrarDashboard from '../components/dashboards/RegistrarDashboard'

const Dashboard = () => {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />
      case 'faculty':
        return <FacultyDashboard />
      case 'hod':
        return <HODDashboard />
      case 'abc':
        return <ABCDashboard />
      case 'superadmin':
        return <SuperAdminDashboard />
      case 'registrar':
        return <RegistrarDashboard />
      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderDashboard()}
    </div>
  )
}

export default Dashboard
