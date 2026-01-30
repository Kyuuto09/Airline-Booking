import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const [recentFlights, setRecentFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentlyViewed = () => {
    fetch(`${import.meta.env.VITE_API_URL}/recently-viewed/`, {
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Recently viewed data:', data);
        setRecentFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recent flights:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  const handleRemoveFromRecent = (flightId) => {
    fetch(`${import.meta.env.VITE_API_URL}/recently-viewed/${flightId}/`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => {
        setRecentFlights(prev => prev.filter(f => f.id !== flightId));
      })
      .catch((error) => {
        console.error("Error removing flight:", error);
      });
  };

  const handleClearAll = () => {
    fetch(`${import.meta.env.VITE_API_URL}/recently-viewed/`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(() => {
        setRecentFlights([]);
      })
      .catch((error) => {
        console.error("Error clearing recent flights:", error);
      });
  };

  if (loading) {
    return (
      <div className="px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-[#5f6368] text-sm">Loading recently viewed flights...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-[#202124] mb-2">
            Recently Viewed Flights
          </h1>
          <p className="text-[#5f6368] text-sm">
            {recentFlights.length > 0 
              ? `Your last ${recentFlights.length} viewed flight${recentFlights.length !== 1 ? 's' : ''}`
              : 'View flight details to see them here'}
          </p>
        </div>
        {recentFlights.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-colors"
          >
            Clear All History
          </button>
        )}
      </div>

      {/* Recently Viewed Flights */}
      {recentFlights.length > 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden">
          <table className="font-sans w-full">
            <thead className="bg-white border-b border-[#e8eaed]">
              <tr>
                <th className="text-left px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                  Flight
                </th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                  Route
                </th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                  Aircraft
                </th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                  Schedule
                </th>
                <th className="text-right px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentFlights.map((flight) => (
                <tr
                  key={flight.id}
                  className="border-b border-[#f1f3f4] last:border-b-0 hover:bg-white/50 transition-colors"
                >
                  {/* Flight Number */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {flight.airline_logo ? (
                        <img 
                          src={flight.airline_logo} 
                          alt={flight.airline_name || 'Airline'}
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
                          <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-[14px] font-semibold text-[#202124]">
                          {flight.flight_number}
                        </div>
                        {flight.airline_name && (
                          <div className="text-[12px] text-[#5f6368]">
                            {flight.airline_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-6">
                      <div className="text-right flex-1 min-w-[120px]">
                        <div className="text-[15px] font-bold text-[#202124] leading-tight mb-0.5">
                          {flight.origin_city}
                        </div>
                        <div className="text-[12px] font-medium text-[#5f6368] bg-white border border-gray-100 inline-block px-1.5 rounded shadow-sm">
                          {flight.origin_code}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-[1px] bg-[#dadce0] relative">
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[#dadce0] rotate-45"></div>
                        </div>
                      </div>

                      <div className="text-left flex-1 min-w-[120px]">
                        <div className="text-[15px] font-bold text-[#202124] leading-tight mb-0.5">
                          {flight.destination_city}
                        </div>
                        <div className="text-[12px] font-medium text-[#5f6368] bg-white border border-gray-100 inline-block px-1.5 rounded shadow-sm">
                          {flight.destination_code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Aircraft */}
                  <td className="px-6 py-4 text-center">
                    <div className="text-[13px] font-medium text-[#202124] bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                      {flight.airplane_name}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <div className="text-[15px] font-semibold text-[#202124]">
                        {new Date(flight.departure_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        <span className="mx-2 text-gray-300">→</span>
                        {new Date(flight.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                      <div className="text-[12px] text-[#5f6368] font-medium">
                        {new Date(flight.departure_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/flight/${flight.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[13px] font-medium shadow-sm"
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleRemoveFromRecent(flight.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove from recently viewed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm p-16 text-center">
          <svg className="w-20 h-20 text-[#dadce0] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-[#5f6368] mb-3">No Recently Viewed Flights</h3>
          <p className="text-[#5f6368] mb-6 max-w-md mx-auto">
            Browse available flights and click "View Details" to start tracking your viewing history
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All Flights
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
