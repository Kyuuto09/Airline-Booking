import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [recentCount, setRecentCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Fetch recently viewed count
    fetch(`${import.meta.env.VITE_API_URL}/recently-viewed/`, {
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setRecentCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching recent count:", error);
      });
  }, [location.pathname]); // Re-fetch when route changes

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-[#e8eaed] sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a73e8] to-[#1765cc] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <h1 className="font-heading text-[20px] font-semibold text-[#202124] group-hover:text-[#1a73e8] transition-colors">
                SkyBook
              </h1>
              <p className="text-[11px] text-[#5f6368] uppercase tracking-wide">
                Airline Booking
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${
                isActive('/')
                  ? 'bg-[#e8f0fe] text-[#1a73e8]'
                  : 'text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>All Flights</span>
              </div>
            </Link>

            <Link
              to="/recently-viewed"
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all ${
                isActive('/recently-viewed')
                  ? 'bg-[#e8f0fe] text-[#1a73e8]'
                  : 'text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Recently Viewed</span>
                {recentCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#1a73e8] text-white text-[11px] font-semibold rounded-full">
                    {recentCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
