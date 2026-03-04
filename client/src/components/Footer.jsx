const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-t border-indigo-500/20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse -bottom-32 -left-32"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse -bottom-32 -right-32" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Horizontal Layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center p-1.5">
              <img 
                src="https://iums.mitsgwalior.in/images/mits-logo.png" 
                alt="MITS Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-white leading-tight">EventMitra</h3>
              <p className="text-xs text-gray-400">MITS-DU, Gwalior</p>
            </div>
          </div>

          {/* Center: Description */}
          <div className="text-xs text-gray-400 text-center max-w-md hidden md:block">
            The Official platform of MITS-DU, Gwalior for streamlining classroom management and event approvals.
          </div>

          {/* Right: Copyright and Developer */}
          <div className="text-xs text-gray-400 text-center sm:text-right">
            <div>© {currentYear} EventMitra, MITS Gwalior</div>
            <div className="mt-0.5">
              <span>Developed by </span>
              <span className="text-white font-medium">Ajay Meena</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
