import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/flights/`)
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
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="text-[#5f6368] text-sm">Loading available flights...</div>
        </div>
      </div>
    );
  }

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
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                        <svg className="w-5 h-5 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-[#202124]">
                          {flight.flight_number}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Route */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-[13px] font-medium text-[#202124]">
                          {flight.origin_code}
                        </div>
                        <div className="text-[12px] text-[#5f6368]">
                          {flight.origin_name}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[#5f6368] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <div>
                        <div className="text-[13px] font-medium text-[#202124]">
                          {flight.destination_code}
                        </div>
                        <div className="text-[12px] text-[#5f6368]">
                          {flight.destination_name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Aircraft */}
                  <td className="px-6 py-5">
                    <div className="text-[13px] text-[#202124]">
                      {flight.airplane_name}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#5f6368] uppercase tracking-wide">Dep</span>
                        <span className="text-[13px] text-[#202124] font-medium">
                          {flight.departure_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#5f6368] uppercase tracking-wide">Arr</span>
                        <span className="text-[13px] text-[#202124] font-medium">
                          {flight.arrival_time}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/flight/${flight.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] transition-colors text-[13px] font-medium shadow-sm"
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
    </div>
  );
};

export default FlightList;