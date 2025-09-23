import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ShowtimeBooking } from "./ShowtimeBooking";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface MovieDetailsProps {
  movieId: string;
  onBack: () => void;
}

export function MovieDetails({ movieId, onBack }: MovieDetailsProps) {
  const movie = useQuery(api.movies.getMovie, { movieId: movieId as Id<"movies"> });
  const showtimes = useQuery(api.movies.getMovieShowtimes, { movieId: movieId as Id<"movies"> });
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);

  if (movie === undefined || showtimes === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-white mb-4">Movie Not Found</h3>
        <button
          onClick={onBack}
          className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-all"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  if (selectedShowtimeId) {
    return (
      <ShowtimeBooking
        showtimeId={selectedShowtimeId}
        onBack={() => setSelectedShowtimeId(null)}
      />
    );
  }

  // Group showtimes by date
  const showtimesByDate = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.showDate]) {
      acc[showtime.showDate] = [];
    }
    acc[showtime.showDate].push(showtime);
    return acc;
  }, {} as Record<string, typeof showtimes>);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
      >
        ← Back to Movies
      </button>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="aspect-[2/3] bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex gap-4 text-white/70 mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{movie.rating}</span>
                <span>{movie.genre}</span>
                <span>{movie.duration} minutes</span>
                <span>Released: {new Date(movie.releaseDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-white/80 text-lg mb-6 leading-relaxed">
              {movie.description}
            </p>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Showtimes</h3>
              {Object.keys(showtimesByDate).length === 0 ? (
                <p className="text-white/70">No showtimes available for this movie.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(showtimesByDate).map(([date, dateShowtimes]) => (
                    <div key={date}>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dateShowtimes.map((showtime) => (
                          <div
                            key={showtime._id}
                            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                            onClick={() => setSelectedShowtimeId(showtime._id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-white font-semibold text-lg">
                                  {showtime.showTime}
                                </div>
                                <div className="text-white/70 text-sm">
                                  {showtime.theater?.name}
                                </div>
                                <div className="text-white/60 text-xs">
                                  {showtime.theater?.location}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-white font-bold">
                                  ₹{showtime.price.toFixed(2)}
                                </div>
                                <div className="text-white/60 text-sm">
                                  {showtime.availableSeats} seats left
                                </div>
                              </div>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                              Book Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
