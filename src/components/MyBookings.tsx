import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function MyBookings() {
  const bookings = useQuery(api.bookings.getUserBookings);

  if (bookings === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">No Bookings Yet</h3>
          <p className="text-white/80">
            You haven't booked any movie tickets yet. Browse movies to make your first booking!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-6">My Bookings</h3>
      
      <div className="space-y-4">
        {bookings.filter(booking => booking !== null).map((booking) => (
          <div
            key={booking._id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">
                  {booking.movie?.title}
                </h4>
                <div className="text-white/70 space-y-1">
                  <p>{booking.theater?.name} - {booking.theater?.location}</p>
                  <p>
                    {new Date(booking.showtime?.showDate || '').toLocaleDateString()} at {booking.showtime?.showTime}
                  </p>
                  <p>Seats: {booking.seatNumbers.join(", ")}</p>
                  <p>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-2">
                  ₹{booking.totalAmount.toFixed(2)}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  booking.bookingStatus === "confirmed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
