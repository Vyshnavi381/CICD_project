import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { PaymentForm } from "./PaymentForm";

interface ShowtimeBookingProps {
  showtimeId: string;
  onBack: () => void;
}

export function ShowtimeBooking({ showtimeId, onBack }: ShowtimeBookingProps) {
  const showtime = useQuery(api.showtimes.getShowtime, { showtimeId: showtimeId as Id<"showtimes"> });
  const bookedSeats = useQuery(api.showtimes.getBookedSeats, { showtimeId: showtimeId as Id<"showtimes"> });
  const createBooking = useMutation(api.bookings.createBooking);
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  if (showtime === undefined || bookedSeats === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-white mb-4">Showtime Not Found</h3>
        <button
          onClick={onBack}
          className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
        >
          Back
        </button>
      </div>
    );
  }

  const totalSeats = showtime.theater?.totalSeats || 100;
  const rows = Math.ceil(totalSeats / 10);
  const seatsPerRow = 10;

  const generateSeatId = (row: number, seat: number) => {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
    return `${rowLetter}${seat + 1}`;
  };

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return; // Can't select booked seats
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setIsBooking(true);
    try {
      const newBookingId = await createBooking({
        showtimeId: showtimeId as Id<"showtimes">,
        seatNumbers: selectedSeats,
      });
      
      setBookingId(newBookingId);
      setShowPayment(true);
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onBack();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setBookingId(null);
  };

  const totalAmount = selectedSeats.length * showtime.price;

  if (showPayment && bookingId) {
    return (
      <div>
        <button
          onClick={() => setShowPayment(false)}
          className="mb-6 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
        >
          ← Back to Seat Selection
        </button>
        <PaymentForm
          bookingId={bookingId}
          totalAmount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{showtime.movie?.title}</h1>
          <div className="text-white/70">
            <p>{showtime.theater?.name} - {showtime.theater?.location}</p>
            <p>{new Date(showtime.showDate).toLocaleDateString()} at {showtime.showTime}</p>
            <p className="text-lg font-semibold text-white mt-2">₹{showtime.price.toFixed(2)} per seat</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white/20 rounded-lg p-4 mb-4 text-center">
            <div className="text-white font-semibold mb-2">SCREEN</div>
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2">
                <div className="w-8 text-white font-semibold text-center">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatId = generateSeatId(rowIndex, seatIndex);
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={isBooked}
                      className={`w-8 h-8 rounded-t-lg text-xs font-semibold transition-all ${
                        isBooked
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {seatIndex + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/20 rounded-t"></div>
              <span className="text-white/70">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t"></div>
              <span className="text-white/70">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-t"></div>
              <span className="text-white/70">Booked</span>
            </div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Booking Summary</h3>
            <div className="text-white/80">
              <p>Selected Seats: {selectedSeats.join(", ")}</p>
              <p>Number of Seats: {selectedSeats.length}</p>
              <p className="text-xl font-bold text-white mt-2">
                Total: ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          disabled={selectedSeats.length === 0 || isBooking}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking ? "Creating Booking..." : `Continue to Payment - ${selectedSeats.length} Seat(s)`}
        </button>
      </div>
    </div>
  );
}
