import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [recentCount, setRecentCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch recently viewed count
    fetch(`${import.meta.env.VITE_API_URL}/recently-viewed/`, {
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setRecentCount(data.length);
        }
      })
      .catch((error) => {
        // Silent error
      });
  }, [location.pathname]); 

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#e8eaed] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1a73e8] to-[#1765cc] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all scale-100 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[18px] font-bold text-[#202124] leading-none group-hover:text-[#1a73e8] transition-colors">
                SkyBook
              </span>
            </div>
          </Link>

          {/* Separator - Desktop */}
          <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

          {/* Primary Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/flights"
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                isActive('/flights')
                  ? 'bg-gray-100 text-[#1a73e8]'
                  : 'text-[#5f6368] hover:bg-gray-50 hover:text-[#202124]'
              }`}
            >
              All Flights
            </Link>
            
            <Link
              to="/recently-viewed"
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all flex items-center gap-2 ${
                isActive('/recently-viewed')
                  ? 'bg-gray-100 text-[#1a73e8]'
                  : 'text-[#5f6368] hover:bg-gray-50 hover:text-[#202124]'
              }`}
            >
              Recently Viewed
              {recentCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[#1a73e8] text-white text-[10px] font-bold rounded-full min-w-[18px] text-center">
                  {recentCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Right: Auth & Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* My Bookings Button - Desktop */}
              <Link
                to="/my-bookings" 
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium transition-colors border ${
                     isActive('/my-bookings') 
                     ? 'border-blue-100 bg-blue-50 text-[#1a73e8]' 
                     : 'border-transparent text-[#5f6368] hover:bg-gray-50 hover:text-[#202124]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                My Bookings
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border transition-all ${
                      isDropdownOpen 
                      ? 'border-blue-200 bg-blue-50/50 shadow-sm ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start mr-1">
                      <span className="text-[13px] font-semibold text-gray-700 leading-none mb-0.5 max-w-[100px] truncate">
                        {user.username}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                        Member
                      </span>
                  </div>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                     <div className="px-5 py-4 border-b border-gray-50 bg-gradient-to-br from-gray-50 to-white">
                        <p className="text-xs text-uppercase tracking-wider font-bold text-gray-400 mb-1">Signed in as</p>
                        <p className="font-semibold text-gray-900 truncate text-[15px]">{user.username}</p>
                     </div>
                     
                     <div className="p-2">
                        <Link 
                           to="/my-bookings" 
                           onClick={() => setIsDropdownOpen(false)} 
                           className="md:hidden flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1"
                        >
                           <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                               </svg>
                           </span>
                           My Bookings
                        </Link>
                         <Link 
                           to="/recently-viewed" 
                           onClick={() => setIsDropdownOpen(false)} 
                           className="md:hidden flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors mb-1"
                        >
                           <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                           </span>
                           Recently Viewed
                        </Link>
                        
                        <button 
                            onClick={logoutUser}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            Sign Out
                        </button>
                     </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                 to="/login"
                 className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                 Log in
              </Link>
              <Link 
                 to="/register"
                 className="px-5 py-2.5 rounded-full text-[14px] font-semibold bg-[#1a73e8] text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-[#1557b0] transition-all transform hover:-translate-y-0.5"
              >
                 Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
