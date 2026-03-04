import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, LogOut, LogIn, Menu, X, ChevronDown, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img 
                  src="https://iums.mitsgwalior.in/images/mits-logo.png" 
                  alt="EventMitra Logo" 
                  className="relative w-12 h-12 object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* EventMitra Text */}
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                EventMitra
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              Home
            </Link>
            {user && (user.role === 'abc' || user.role === 'superadmin') && (
              <Link to="/clubs" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Clubs
              </Link>
            )}
            {user && user.role === 'faculty' && (
              <Link to="/apply-event" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Create Event
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                Dashboard
              </Link>
            )}
            <Link to="/developer" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
              Developer
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 transition-all ml-2"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                >
                  <User className="w-4 h-4 text-purple-300" />
                  <div className="text-left">
                    <div className="text-sm text-purple-300 font-semibold">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 backdrop-blur-lg rounded-lg shadow-2xl border border-purple-500/30 overflow-hidden z-50">
                    <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.name}</p>
                          <p className="text-purple-300 text-sm capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      {user.email && (
                        <div className="px-3 py-2 text-sm text-gray-300">
                          <span className="text-gray-500">Email:</span>
                          <p className="text-purple-300">{user.email}</p>
                        </div>
                      )}
                      {user.branch && (
                        <div className="px-3 py-2 text-sm text-gray-300">
                          <span className="text-gray-500">Branch:</span>
                          <p className="text-purple-300">{user.branch}</p>
                        </div>
                      )}
                      {user.enrollmentNo && (
                        <div className="px-3 py-2 text-sm text-gray-300">
                          <span className="text-gray-500">Enrollment:</span>
                          <p className="text-purple-300">{user.enrollmentNo}</p>
                        </div>
                      )}
                      {user.department && (
                        <div className="px-3 py-2 text-sm text-gray-300">
                          <span className="text-gray-500">Department:</span>
                          <p className="text-purple-300">{user.department}</p>
                        </div>
                      )}
                      
                      <div className="border-t border-purple-500/30 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-purple-500/50 ml-2"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-purple-400 p-2 rounded-lg hover:bg-white/10 transition-all">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all">
              Home
            </Link>
            {user && (user.role === 'abc' || user.role === 'superadmin') && (
              <Link to="/clubs" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all">
                Clubs
              </Link>
            )}
            {user && user.role === 'faculty' && (
              <Link to="/apply-event" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all">
                Create Event
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all">
                Dashboard
              </Link>
            )}
            <Link to="/developer" className="block px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all">
              Developer
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 text-gray-300 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-all"
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            {user ? (
              <>
                <div className="px-3 py-2 text-purple-300 text-sm">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-purple-400 hover:bg-white/5 rounded-lg transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
