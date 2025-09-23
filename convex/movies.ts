import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listMovies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getMoviesByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("movies")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.eq(q.field("genre"), args.genre)
        )
      )
      .collect();
  },
});

export const getAvailableGenres = query({
  args: {},
  handler: async (ctx) => {
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    const genres = [...new Set(movies.map(movie => movie.genre))];
    return genres.sort();
  },
});

export const getRecentMovies = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 6;
    
    return await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(limit);
  },
});

export const getPopularMovies = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 6;
    
    // Get movies with the most showtimes (indicating popularity)
    const showtimes = await ctx.db.query("showtimes").collect();
    const movieShowtimeCounts = showtimes.reduce((acc, showtime) => {
      acc[showtime.movieId] = (acc[showtime.movieId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    // Sort by showtime count (popularity) and take the limit
    const popularMovies = movies
      .sort((a, b) => (movieShowtimeCounts[b._id] || 0) - (movieShowtimeCounts[a._id] || 0))
      .slice(0, limit);
    
    return popularMovies;
  },
});

export const getMovie = query({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.movieId);
  },
});

export const addMovie = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    genre: v.string(),
    duration: v.number(),
    rating: v.string(),
    posterUrl: v.string(),
    releaseDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("movies", {
      ...args,
      isActive: true,
    });
  },
});

export const getMovieShowtimes = query({
  args: { movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const showtimes = await ctx.db
      .query("showtimes")
      .withIndex("by_movie", (q) => q.eq("movieId", args.movieId))
      .collect();
    
    const showtimesWithTheaters = await Promise.all(
      showtimes.map(async (showtime) => {
        const theater = await ctx.db.get(showtime.theaterId);
        return {
          ...showtime,
          theater,
        };
      })
    );
    
    return showtimesWithTheaters;
  },
});
