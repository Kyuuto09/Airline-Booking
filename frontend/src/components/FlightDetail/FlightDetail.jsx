import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const FlightDetail = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching flight details for ID:', id);
    fetch(`${import.meta.env.VITE_API_URL}/flights/${id}/`, {
      credentials: 'include'  // Important: send session cookies
    })
      .then((response) => {
        console.log('Flight detail response status:', response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }
        return response.json();
      })
      .then((data) => {
        console.log('Flight detail received:', data.flight_number);
        setFlight(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flight:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-[#5f6368] text-sm">Loading flight details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Unable to load flight</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <Link to="/flights" className="inline-flex items-center text-[#1a73e8] hover:underline text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to flights
          </Link>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="text-[#5f6368] mb-4">Flight not found</div>
          <Link to="/flights" className="text-[#1a73e8] hover:underline text-sm">
            ← Back to flights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-[1200px] mx-auto">
      {/* Back button */}
      <Link 
        to="/flights" 
        className="inline-flex items-center text-[#5f6368] hover:text-[#202124] text-[13px] mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to all flights
      </Link>

      {/* Flight Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 text-white shadow-lg relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Airline Logo & Name */}
          <div className="flex items-center gap-6">
            {flight.airline_logo && (
              <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
                <img 
                  src={flight.airline_logo} 
                  alt={flight.airline_name || 'Airline'}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              {flight.airline_name && (
                <div className="text-blue-100 text-sm uppercase tracking-wider font-semibold mb-1">
                  {flight.airline_name}
                </div>
              )}
              <h1 className="font-heading text-5xl font-bold tracking-tight">
                {flight.flight_number}
              </h1>
            </div>
          </div>

          {/* Route & Aircraft Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Route */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-bold text-3xl tracking-wide">{flight.origin_code}</div>
                <div className="text-blue-100 text-sm mt-1 font-medium truncate max-w-[150px]" title={flight.origin_name}>
                  {flight.origin_name}
                </div>
              </div>
              
              <div className="flex flex-col items-center opacity-60">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-3xl tracking-wide">{flight.destination_code}</div>
                <div className="text-blue-100 text-sm mt-1 font-medium truncate max-w-[150px]" title={flight.destination_name}>
                  {flight.destination_name}
                </div>
              </div>
            </div>

            {/* Vertical Separator (Desktop) */}
            <div className="hidden md:block w-px h-16 bg-white/20"></div>

            {/* Aircraft Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-5 py-3 text-center min-w-[140px]">
              <div className="text-blue-100 text-[10px] uppercase tracking-wider font-bold mb-0.5">Aircraft</div>
              <div className="font-semibold text-base">{flight.airplane_name}</div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Flight Details Card */}
          <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden h-full">
            <div className="border-b border-[#e8eaed] px-6 py-4 bg-gray-50">
              <h2 className="font-heading text-[15px] font-semibold text-[#202124]">
                Flight Details
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Departure */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="flex items-center gap-2 mb-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span className="text-[11px] text-green-700 uppercase tracking-wider font-bold">
                      Departure
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-[#202124]">
                    {new Date(flight.departure_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-[14px] text-[#5f6368] font-medium">
                    {new Date(flight.departure_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="w-full pt-4 border-t border-[#f1f3f4] mt-4 flex flex-col items-center">
                    <div className="text-[16px] font-semibold text-[#202124]">
                      {flight.origin_name}
                    </div>
                    <div className="text-[14px] text-[#5f6368] mt-1 font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {flight.origin_code}
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-center text-center space-y-3 relative">
                  {/* Vertical Divider for Desktop */}
                  <div className="hidden md:block absolute left-0 top-4 bottom-4 w-px bg-gray-100 -ml-5"></div>
                  
                  <div className="flex items-center gap-2 mb-2 bg-blue-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-[11px] text-blue-700 uppercase tracking-wider font-bold">
                      Arrival
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-[#202124]">
                    {new Date(flight.arrival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-[14px] text-[#5f6368] font-medium">
                    {new Date(flight.arrival_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="w-full pt-4 border-t border-[#f1f3f4] mt-4 flex flex-col items-center">
                    <div className="text-[16px] font-semibold text-[#202124]">
                      {flight.destination_name}
                    </div>
                    <div className="text-[14px] text-[#5f6368] mt-1 font-mono bg-gray-100 px-2 py-0.5 rounded">
                      {flight.destination_code}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e8eaed] shadow-sm overflow-hidden h-full">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="font-heading text-[15px] font-semibold text-[#202124] mb-3">
                  Ready to book?
                </h3>
                <p className="text-[13px] text-[#5f6368] leading-relaxed mb-6">
                  Reserve your seat on this flight and complete your booking.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to={`/booking/${flight.id}`}
                  className="w-full block text-center px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[14px] font-semibold shadow-sm"
                >
                  Continue to Seat Selection
                </Link>
                
                <div className="pt-4 border-t border-[#e8eaed]">
                  <div className="text-[11px] text-[#5f6368] uppercase tracking-wider font-semibold mb-3">
                    Flight Summary
                  </div>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#5f6368]">Flight</span>
                      <span className="text-[#202124] font-semibold">{flight.flight_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#5f6368]">Aircraft</span>
                      <span className="text-[#202124] font-semibold">{flight.airplane_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
