import { Link } from "react-router-dom";

// The main component that renders the Landing Page
const Landing = () => {
  return (
    <div className="relative min-h-screen font-sans antialiased overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6 lg:px-12">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo.svg" alt="logo" />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Share Your
                  <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Moments
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                  Capture and share life's best memories with the world.
                  SnapGram makes it easy to tell your story through beautiful
                  photos.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-3 backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Capture
                  </h3>
                  <p className="text-white/80 text-sm">
                    Share stunning photos and explore
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-3 backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Explore
                  </h3>
                  <p className="text-white/80 text-sm">
                    From your world to theirs in a snap
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-3 backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Share
                  </h3>
                  <p className="text-white/80 text-sm">
                    Connect with friends and share your creativity
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/sign-up"
                  className="btn-primary text-lg px-8 py-4 rounded-2xl font-semibold
                           bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105
                           transition-all duration-300 transform shadow-2xl hover:shadow-2xl">
                  Create an Account
                </Link>
                <Link
                  to="/sign-in"
                  className="btn-ghost text-lg px-8 py-4 rounded-2xl font-semibold
                           border-2 border-white/30 text-white hover:bg-white/10
                           transition-all duration-300 transform hover:scale-105">
                  Log In
                </Link>
              </div>
            </div>

            {/* Right Content - Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                {/* Phone Mockup */}
                <div className="relative mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Mockup Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg">SnapGram</h3>
                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Mockup Content */}
                    <div className="p-4 space-y-4">
                      {/* Mock Post 1 */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                          <div>
                            <div className="w-20 h-3 bg-gray-300 rounded mb-1"></div>
                            <div className="w-16 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mb-2"></div>
                        <div className="w-24 h-3 bg-gray-300 rounded"></div>
                      </div>

                      {/* Mock Post 2 */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                          <div>
                            <div className="w-24 h-3 bg-gray-300 rounded mb-1"></div>
                            <div className="w-20 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-br from-pink-400 to-orange-500 rounded-lg mb-2"></div>
                        <div className="w-32 h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 lg:px-12 text-center">
          <p className="text-white/60 text-sm">
            © 2025 SnapGram. Made with ❤️ for photographers and creators.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
