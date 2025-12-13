import { useEffect, useState } from "react";

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
    return <div className="text-center py-10">Loading flights...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-[#dadce0] shadow-sm overflow-hidden">
        <table className="font-sans w-full">
          <thead>
            <tr className="border-b border-[#e8eaed]">
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Flight Number
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Origin
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Destination
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Airplane
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Departure
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-medium text-[#5f6368] uppercase tracking-wide">
                Arrival
              </th>
            </tr>
          </thead>
          <tbody>
            {flights.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center px-6 py-16 text-sm text-[#5f6368]">
                  No flights available
                </td>
              </tr>
            ) : (
              flights.map((flight) => (
                <tr
                  key={flight.id}
                  className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-[13px] font-medium text-[#1a73e8]">
                    {flight.flight_number}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#202124]">
                    {flight.origin_name} <span className="text-[#5f6368]">({flight.origin_code})</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#202124]">
                    {flight.destination_name} <span className="text-[#5f6368]">({flight.destination_code})</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#202124]">{flight.airplane_name}</td>
                  <td className="px-6 py-4 text-[13px] text-[#202124]">{flight.departure_time}</td>
                  <td className="px-6 py-4 text-[13px] text-[#202124]">{flight.arrival_time}</td>
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