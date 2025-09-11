import { Link } from "react-router-dom";

// The main component that renders the Landing Page
const Landing = () => {
  // State for managing a message box, if needed

  return (
    <div className="relative min-h-screen font-sans antialiased text-white bg-gray-900">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://travelguideandphotography.com/wp-content/uploads/2020/03/d8_2763-hoi-an-lanterns.jpg?w=596&h=397"
          alt="Night street in Asia with lanterns"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content Container with Z-index to be on top of the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="text-2xl font-bold">
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center flex-grow p-4 text-center">
          <h1 className="mb-4 text-6xl font-bold">
            SnapShare
          </h1>
          <p className="max-w-xl mx-auto mb-8 text-lg font-light">
            Share your moments, one snap at a time. SnapShare is the easiest way to capture, edit, and share life's best memories with the people all around the world.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Link
              to="/sign-up"
              className="px-6 py-3 font-semibold text-white transition duration-300 ease-in-out transform border-2 border-white rounded-full bg-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white hover:text-gray-900">
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="px-6 py-3 font-semibold text-white transition duration-300 ease-in-out transform border-2 border-white rounded-full bg-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white hover:text-gray-900">
              Login
            </Link>
          </div>
        </main>

      </div>
    </div>
  );
};

export default Landing;
