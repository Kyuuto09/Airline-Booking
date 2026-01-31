import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Modal from '../UI/Modal';

export default function MyBookings() {
  const { authTokens, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: null });

  useEffect(() => {
    if (!authTokens) {
        setLoading(false);
        return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/reservations/`, {
        headers: {
            'Authorization': 'Bearer ' + String(authTokens.access)
        }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [authTokens]);

  const initiateCancel = (id) => {
      setCancelModal({ isOpen: true, bookingId: id });
  };

  const confirmCancel = async () => {
      const id = cancelModal.bookingId;
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/reservations/${id}/`, {
              method: 'DELETE',
              headers: {
                  'Authorization': 'Bearer ' + String(authTokens.access)
              }
          });
          
          if (response.ok) {
              setBookings(bookings.filter(b => b.id !== id));
              setCancelModal({ isOpen: false, bookingId: null });
          } else {
              console.error("Failed to cancel booking");
              // Optional: Show error state
          }
      } catch (err) {
          console.error(err);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#5f6368]">Loading your trips...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-[#202124] mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8eaed] p-12 text-center">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#202124] mb-2">No upcoming trips</h2>
            <p className="text-[#5f6368] mb-6">You haven't booked any flights yet.</p>
            <Link to="/flights" className="inline-flex items-center justify-center px-6 py-3 bg-[#1a73e8] text-white rounded-xl font-medium hover:bg-[#1765cc] transition-colors shadow-sm">
                Explore Flights
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-[#e8eaed] overflow-hidden flex flex-col md:flex-row relative group hover:shadow-md transition-shadow">
                
                {/* Left Strip - Status Color */}
                <div className={`h-2 md:h-auto md:w-3 ${booking.status === 'CONFIRMED' ? 'bg-[#1a73e8]' : 'bg-gray-400'}`}></div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
                        {/* Route Info */}
                        <div className="flex items-center gap-6">
                             <div>
                                <div className="text-3xl font-bold text-[#202124]">{booking.flight_details.origin_code}</div>
                                <div className="text-sm text-[#5f6368]">{booking.flight_details.origin_city}</div>
                             </div>
                             <div className="flex flex-col items-center">
                                <div className="text-xs text-[#5f6368] font-mono mb-1">{booking.flight_details.airplane_name}</div>
                                <div className="w-24 h-px bg-[#dadce0] relative">
                                    <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-[#dadce0] rotate-45"></div>
                                </div>
                                <div className="text-xs text-[#1a73e8] font-bold mt-1">Direct</div>
                             </div>
                             <div>
                                <div className="text-3xl font-bold text-[#202124]">{booking.flight_details.destination_code}</div>
                                <div className="text-sm text-[#5f6368]">{booking.flight_details.destination_city}</div>
                             </div>
                        </div>

                        {/* Airline Info */}
                         <div className="flex items-center gap-3">
                             {booking.flight_details.airline_logo && (
                                 <img src={booking.flight_details.airline_logo} alt="Logo" className="h-8 w-auto object-contain" />
                             )}
                             <div className="text-right">
                                 <div className="text-sm font-semibold text-[#202124]">{booking.flight_details.airline_name}</div>
                                 <div className="text-xs text-[#5f6368]">Flight {booking.flight_details.flight_number}</div>
                             </div>
                         </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-6 pt-6 border-t border-[#f1f3f4]">
                        <div className="flex gap-8 md:gap-12">
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-[#5f6368] font-bold mb-1">Date</div>
                                <div className="text-sm font-medium text-[#202124]">
                                    {new Date(booking.flight_details.departure_time).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-[#5f6368] font-bold mb-1">Time</div>
                                <div className="text-sm font-medium text-[#202124]">
                                    {new Date(booking.flight_details.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] uppercase tracking-wider text-[#5f6368] font-bold mb-1">Gate</div>
                                <div className="text-sm font-medium text-[#202124]">TBD</div>
                            </div>
                             <div>
                                <div className="text-[11px] uppercase tracking-wider text-[#5f6368] font-bold mb-1">Seat</div>
                                <div className="text-xl font-bold text-[#1a73e8]">
                                    {booking.seat_details.row}{booking.seat_details.column}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => initiateCancel(booking.id)}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Cancel Booking
                        </button>
                    </div>
                </div>

                {/* Perforated Edge Visual (Desktop) */}
                <div className="hidden md:flex flex-col justify-between py-2 bg-white border-l border-dashed border-gray-300 w-px absolute right-0 top-0 bottom-0 h-full z-10"></div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, bookingId: null })}
        title="Cancel Flight"
        type="default"
        footer={
           <>
             <button
                onClick={confirmCancel}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
             >
               Yes, Cancel Booking
             </button>
             <button
                onClick={() => setCancelModal({ isOpen: false, bookingId: null })}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
             >
               Keep Flight
             </button>
           </>
        }
      >
        Are you sure you want to cancel this reservation? This action cannot be undone.
      </Modal>
    </div>
  );
}
