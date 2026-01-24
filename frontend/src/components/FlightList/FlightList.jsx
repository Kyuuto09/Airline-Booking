import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    origin: '',
    destination: ''
  });

  const fetchFlights = (searchParams = {}) => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/flights/?`;
    const params = new URLSearchParams();
    
    // Strict filtering: 'origin' input only filters by origin city/code
    if (searchParams.origin) params.append('origin', searchParams.origin);
    
    // Strict filtering: 'destination' input only filters by destination city/code
    if (searchParams.destination) params.append('destination', searchParams.destination);
    
    fetch(url + params.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        return response.json();
      })
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flights:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights(filters);
  };

  if (error) {
    return (
      <div className="px-6 py-12 max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Unable to load flights</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-[#202124] mb-2">
          Available Flights
        </h1>
        <p className="text-[#5f6368] text-sm">
          Browse and select from {flights.length} available flight{flights.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 relative z-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* From Input */}
          <div className="md:col-span-5 relative group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              From
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </div>
              <input
                type="text"
                placeholder="City or Airport"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={filters.origin}
                onChange={(e) => setFilters({...filters, origin: e.target.value})}
              />
            </div>
          </div>

          {/* To Input */}
          <div className="md:col-span-5 relative group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              To
            </label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
               </div>
              <input
                type="text"
                placeholder="City or Airport"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                value={filters.destination}
                onChange={(e) => setFilters({...filters, destination: e.target.value})}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button 
              type="submit"
              className="w-full py-3 bg-[#1a73e8] hover:bg-[#1765cc] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
      <div className="px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-[#5f6368] text-sm animate-pulse">Loading available flights...</div>
        </div>
      </div>
      ) : (
      <>
      {/* Flights Table */}
      <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden">
        <table className="font-sans w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-[#e8eaed]">
              <th className="text-left px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Flight
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Route
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Aircraft
              </th>
              <th className="text-left px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Schedule
              </th>
              <th className="text-right px-6 py-4 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center px-6 py-20">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-[#dadce0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div className="text-[#5f6368] text-sm">No flights available</div>
                  </div>
                </td>
              </tr>
            ) : (
              flights.map((flight) => (
                <tr
                  key={flight.id}
                  className="border-b border-[#f1f3f4] last:border-b-0 hover:bg-[#f8f9fa] transition-colors"
                >
                  {/* Flight Number */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {flight.airline_logo ? (
                        <img 
                          src={flight.airline_logo} 
                          alt={flight.airline_name || 'Airline'}
                          className="w-10 h-10 object-contain rounded-lg bg-white border border-gray-100 p-1"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                          <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-6">
                      <div className="text-right flex-1 min-w-[120px]">
                        <div className="text-[15px] font-bold text-[#202124] leading-tight mb-0.5">
                          {flight.origin_city}
                        </div>
                        <div className="text-[12px] font-medium text-[#5f6368] bg-gray-100 inline-block px-1.5 rounded">
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
                        <div className="text-[12px] font-medium text-[#5f6368] bg-gray-100 inline-block px-1.5 rounded">
                          {flight.destination_code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Aircraft */}
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-medium text-[#202124] bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                      {flight.airplane_name}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
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

                  {/* Action */}
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/flight/${flight.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[13px] font-medium shadow-sm hover:shadow-md whitespace-nowrap"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
};

export default FlightList;