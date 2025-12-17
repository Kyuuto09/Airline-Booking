import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const FlightDetail = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/flights/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }
        return response.json();
      })
      .then((data) => {
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
          <Link to="/" className="inline-flex items-center text-[#1a73e8] hover:underline text-sm">
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
          <Link to="/" className="text-[#1a73e8] hover:underline text-sm">
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
        to="/" 
        className="inline-flex items-center text-[#5f6368] hover:text-[#202124] text-[13px] mb-6 transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to all flights
      </Link>

      {/* Flight Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-6 text-white shadow-md">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-blue-100 text-xs uppercase tracking-wide mb-2">Flight</div>
            <h1 className="font-heading text-4xl font-semibold mb-6">
              {flight.flight_number}
            </h1>
            <div className="flex items-center gap-4 text-lg">
              <div>
                <div className="font-semibold text-xl">{flight.origin_code}</div>
                <div className="text-blue-100 text-sm mt-1">{flight.origin_name}</div>
              </div>
              <svg className="w-6 h-6 text-blue-200 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div>
                <div className="font-semibold text-xl">{flight.destination_code}</div>
                <div className="text-blue-100 text-sm mt-1">{flight.destination_name}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3">
            <div className="text-blue-100 text-xs uppercase tracking-wide mb-1">Aircraft</div>
            <div className="font-semibold text-lg">{flight.airplane_name}</div>
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
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-[#5f6368] uppercase tracking-wider font-semibold">
                      Departure
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[#202124]">
                    {flight.departure_time.split(' ')[1]}
                  </div>
                  <div className="text-[13px] text-[#5f6368] font-medium">
                    {flight.departure_time.split(' ')[0]}
                  </div>
                  <div className="pt-3 border-t border-[#f1f3f4] mt-4">
                    <div className="text-[15px] font-semibold text-[#202124]">
                      {flight.origin_name}
                    </div>
                    <div className="text-[13px] text-[#5f6368] mt-1">
                      {flight.origin_code}
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-[#5f6368] uppercase tracking-wider font-semibold">
                      Arrival
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[#202124]">
                    {flight.arrival_time.split(' ')[1]}
                  </div>
                  <div className="text-[13px] text-[#5f6368] font-medium">
                    {flight.arrival_time.split(' ')[0]}
                  </div>
                  <div className="pt-3 border-t border-[#f1f3f4] mt-4">
                    <div className="text-[15px] font-semibold text-[#202124]">
                      {flight.destination_name}
                    </div>
                    <div className="text-[13px] text-[#5f6368] mt-1">
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
                <button className="w-full px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[14px] font-semibold shadow-sm">
                  Continue to Booking
                </button>
                
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
