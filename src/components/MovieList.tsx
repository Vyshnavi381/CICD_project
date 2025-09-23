import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { MovieDetails } from "./MovieDetails";
import { toast } from "sonner";

export function MovieList() {
  const movies = useQuery(api.movies.listMovies);
  const recentMovies = useQuery(api.movies.getRecentMovies, { limit: 6 });
  const popularMovies = useQuery(api.movies.getPopularMovies, { limit: 6 });
  const availableGenres = useQuery(api.movies.getAvailableGenres);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const seedData = useMutation(api.seedData.seedMoviesAndTheaters);

  const genreMovies = useQuery(
    api.movies.getMoviesByGenre, 
    selectedGenre ? { genre: selectedGenre } : "skip"
  );

  const handleSeedData = async () => {
    try {
      await seedData({});
      toast.success("Sample movies and theaters added!");
    } catch (error) {
      toast.error("Failed to seed data");
    }
  };

  if (movies === undefined || recentMovies === undefined || popularMovies === undefined || availableGenres === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (selectedMovieId) {
    return (
      <MovieDetails 
        movieId={selectedMovieId} 
        onBack={() => setSelectedMovieId(null)} 
      />
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">No Movies Available</h3>
          <p className="text-white/80 mb-6">
            Get started by adding some sample movies and theaters to explore the platform.
          </p>
          <button
            onClick={handleSeedData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Add Sample Data
          </button>
        </div>
      </div>
    );
  }

  const MovieCard = ({ movie }: { movie: any }) => (
    <div
      key={movie._id}
      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all transform hover:scale-105 cursor-pointer"
      onClick={() => setSelectedMovieId(movie._id)}
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-sm font-medium inline-block mb-2">
            {movie.rating}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
          {movie.title}
        </h4>
        <p className="text-white/70 text-sm mb-3 line-clamp-2">
          {movie.description}
        </p>
        <div className="flex justify-between items-center text-sm text-white/60">
          <span>{movie.genre}</span>
          <span>{movie.duration} min</span>
        </div>
      </div>
    </div>
  );

  const displayMovies = selectedGenre ? genreMovies || [] : movies;

  return (
    <div className="space-y-12">
      {/* Genre Filter */}
      {availableGenres.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Browse by Genre</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedGenre === null
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              All Genres
            </button>
            {availableGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Movies Section - Only show when not filtering by genre */}
      {!selectedGenre && popularMovies.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Popular Movies</h3>
            <div className="text-white/60 text-sm">
              Most showtimes
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Movies Section - Only show when not filtering by genre */}
      {!selectedGenre && recentMovies.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Recent Movies</h3>
            <div className="text-white/60 text-sm">
              Latest releases
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {recentMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* All Movies or Filtered Movies Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {selectedGenre ? `${selectedGenre} Movies` : "All Movies"}
          </h3>
          <button
            onClick={handleSeedData}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
          >
            Add More Movies
          </button>
        </div>
        
        {displayMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <h4 className="text-xl font-bold text-white mb-4">
                No {selectedGenre} Movies Found
              </h4>
              <p className="text-white/80">
                Try selecting a different genre or add more movies to the platform.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
