import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addShowtime = mutation({
  args: {
    movieId: v.id("movies"),
    theaterId: v.id("theaters"),
    showDate: v.string(),
    showTime: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const theater = await ctx.db.get(args.theaterId);
    if (!theater) {
      throw new Error("Theater not found");
    }
    
    return await ctx.db.insert("showtimes", {
      ...args,
      availableSeats: theater.totalSeats,
    });
  },
});

export const getShowtime = query({
  args: { showtimeId: v.id("showtimes") },
  handler: async (ctx, args) => {
    const showtime = await ctx.db.get(args.showtimeId);
    if (!showtime) return null;
    
    const movie = await ctx.db.get(showtime.movieId);
    const theater = await ctx.db.get(showtime.theaterId);
    
    return {
      ...showtime,
      movie,
      theater,
    };
  },
});

export const getBookedSeats = query({
  args: { showtimeId: v.id("showtimes") },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_showtime", (q) => q.eq("showtimeId", args.showtimeId))
      .filter((q) => q.eq(q.field("bookingStatus"), "confirmed"))
      .collect();
    
    const bookedSeats = bookings.flatMap(booking => booking.seatNumbers);
    return bookedSeats;
  },
});
