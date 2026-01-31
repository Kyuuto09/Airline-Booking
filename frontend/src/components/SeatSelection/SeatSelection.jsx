import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Modal from '../UI/Modal';

export default function SeatSelection() {
  const { id } = useParams(); // Flight ID
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, type: 'default', title: '', message: '', onConfirm: null });

  const closeModal = () => {
      setModal(prev => ({ ...prev, isOpen: false }));
      if (modal.onConfirm) modal.onConfirm();
  };

  // 1. Fetch Seats & Availability
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/flights/${id}/seats/`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load seats');
        return res.json();
      })
      .then(data => {
        setSeats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to load seat map. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  // 2. Handle Booking Logic
  const handleBooking = async () => {
    if (!selectedSeat) return;
    if (!user) {
        setModal({
            isOpen: true,
            type: 'default',
            title: 'Authentication Required',
            message: 'Please login to book a flight.',
            onConfirm: () => navigate('/login')
        });
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/reservations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                flight: id,
                seat: selectedSeat.id,
                status: 'CONFIRMED',
                expires_at: new Date(Date.now() + 24*60*60*1000).toISOString() // Fake expiry for now
            })
        });

        if (response.ok) {
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Booking Confirmed!',
                message: 'Your seat has been reserved successfully. Pack your bags! 🎉',
                onConfirm: () => navigate('/my-bookings')
            });
        } else {
            const data = await response.json();
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Booking Failed',
                message: data.detail || JSON.stringify(data),
                onConfirm: null
            });
        }
    } catch (err) {
        console.error(err);
        setModal({
            isOpen: true,
            type: 'error',
            title: 'System Error',
            message: 'An unexpected error occurred while booking. Please try again.',
            onConfirm: null
        });
    }
  };

  // Helper to group seats by Row (for grid layout)
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    // Order A, B, C
    acc[seat.row].sort((a, b) => a.column.localeCompare(b.column)); 
    return acc;
  }, {});

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#5f6368]">Loading Seat Map...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-sm border border-[#e8eaed] overflow-hidden p-8">
        
        <header className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#202124] mb-2">Select Your Seat</h1>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#5f6368]">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-[#dadce0] bg-white"></div>
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#1a73e8]"></div>
                <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#f1f3f4] text-[#dadce0]"></div>
                <span>Occupied</span>
            </div>
          </div>
        </header>

        {/* The Plane Body */}
        <div className="relative w-full flex flex-col items-center bg-gray-50/50 rounded-xl border-x-4 border-gray-200 py-10 px-4 overflow-y-auto max-h-[600px] scrollbar-hide">
            
            {/* Cockpit / Front indicator */}
            <div className="sticky top-0 z-10 w-20 h-16 bg-gradient-to-b from-gray-200 to-gray-50 rounded-t-full mb-8 border-t border-l border-r border-gray-300 shadow-sm flex items-center justify-center">
               <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-4">
            {Object.keys(seatsByRow).map((rowNum) => (
                <div key={rowNum} className="flex items-center gap-6 md:gap-10">
                    {/* Row Number Left */}
                    <div className="w-6 text-right text-[10px] font-bold text-gray-400 font-mono">{rowNum}</div>
                    
                    <div className="flex gap-2 md:gap-3">
                        {seatsByRow[rowNum].map((seat, idx) => {
                            const isSelected = selectedSeat?.id === seat.id;
                            const isReserved = seat.is_reserved;
                            
                            // Visual break for aisle (assuming 6 seats: 3-3 layout)
                            // This is a heuristic; simpler is just a gap
                            const isAisle = idx === 2 && seatsByRow[rowNum].length > 3;

                            return (
                                <div key={seat.id} className="flex gap-2 md:gap-3">
                                <button    
                                    disabled={isReserved}
                                    onClick={() => setSelectedSeat(seat)}
                                    className={`
                                        w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 relative group
                                        ${isReserved 
                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed border border-dashed border-gray-200' 
                                            : isSelected 
                                                ? 'bg-[#1a73e8] text-white shadow-lg shadow-blue-200 scale-105 border border-blue-600'
                                                : 'bg-white border border-gray-200 text-[#5f6368] hover:border-[#1a73e8] hover:text-[#1a73e8] hover:shadow-md'
                                        }
                                    `}
                                >
                                    {seat.column}
                                    {!isReserved && !isSelected && (
                                       <div className="absolute inset-x-0 -bottom-1 h-1 bg-gray-100 rounded-b-lg group-hover:bg-blue-100 transition-colors"></div>
                                    )}
                                </button>
                                {isAisle && <div className="w-6 md:w-8"></div>}
                                </div>
                            );
                        })}
                    </div>
                     {/* Row Number Right */}
                    <div className="w-6 text-left text-[10px] font-bold text-gray-400 font-mono">{rowNum}</div>
                </div>
            ))}
            </div>
        </div>

        {/* Action Bar */}
        <div className="border-t border-[#e8eaed] pt-8 flex justify-between items-center">
            <div>
                <p className="text-sm text-[#5f6368] mb-1">Selected Seat</p>
                <p className="text-2xl font-bold text-[#202124]">
                    {selectedSeat ? `${selectedSeat.row}${selectedSeat.column}` : '-'}
                </p>
            </div>
            <button
                onClick={handleBooking}
                disabled={!selectedSeat}
                className={`px-8 py-3 rounded-xl font-bold text-[14px] transition-all ${
                    selectedSeat 
                    ? 'bg-[#1a73e8] text-white hover:bg-[#1765cc] shadow-md shadow-blue-200 hover:shadow-lg' 
                    : 'bg-[#f1f3f4] text-[#dadce0] cursor-not-allowed'
                }`}
            >
                Confirm Booking
            </button>
        </div>

      </div>

      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
        footer={
          <button 
             onClick={closeModal}
             className="w-full sm:w-auto px-5 py-2.5 bg-[#1a73e8] text-white text-sm font-medium rounded-lg hover:bg-[#1765cc] transition-colors"
          >
            {modal.type === 'success' ? 'View My Bookings' : 'Okay'}
          </button>
        }
      >
        {modal.message}
      </Modal>
    </div>
  );
}
