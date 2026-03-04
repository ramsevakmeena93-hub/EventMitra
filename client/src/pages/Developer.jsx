import { Mail, Linkedin, Github, GraduationCap, Briefcase, Award, Code2, Sparkles } from 'lucide-react'

const Developer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Code2 className="w-64 h-64 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-6 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-indigo-700 dark:text-indigo-300 font-semibold">Meet the Developer</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Ajay Meena
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Full Stack Web Developer & AI Enthusiast</p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-4 border-indigo-500 dark:border-indigo-400 shadow-lg transform hover:scale-105 transition-transform">
                  <img 
                    src="/ajay-meena.png" 
                    alt="Ajay Meena" 
                    className="w-full h-full object-cover object-top"
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    MITS Gwalior
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="text-center mt-8 mb-6">
                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-300 text-sm font-medium">Available for Projects</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <a
                  href="mailto:25tc1aj7@mitsgwl.ac.in"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">25tc1aj7@mitsgwl.ac.in</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/ajay-meena-607a7b376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Connect with me</p>
                  </div>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">GitHub</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">View Projects</p>
                  </div>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hackathons Won</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-indigo-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Madhav Institute of Technology & Science
                    </h3>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full">
                      2025 - 2029
                    </span>
                  </div>
                  <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-3">
                    B.Tech in Computer Science & Technology
                  </p>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">Enrollment: <span className="font-semibold text-gray-900 dark:text-white">BTTC25O1007</span></span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Centre for Computer Science & Technology
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Software Intern</h3>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">
                      Nov 2025 - Jan 2026
                    </span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">Yuga Yatra Retails</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Bangalore, India
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Achievements</h2>
              </div>
              
              <div className="grid gap-3">
                {[
                  'All India Rank 1 in Quick Quest conducted by ISBM Bangalore',
                  'Winner of 3 Hackathons in various cutting-edge technologies',
                  'Worked on 7+ projects in different fields including Web Development, AI/ML, Blockchain, and Hardware'
                ].map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Under the Guidance of Section */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Under the Guidance of
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Mentor Card */}
              <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 dark:border-indigo-400 flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img 
                    src="https://via.placeholder.com/150" 
                    alt="Dr. Abhishek Dixit" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Dr. Abhishek Dixit
                  </h3>
                  <p className="text-indigo-700 dark:text-indigo-300 font-medium mb-1">
                    Assistant Professor & Coordinator
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Centre for Computer Science and Technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Developer
