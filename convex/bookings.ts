import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createBooking = mutation({
  args: {
    showtimeId: v.id("showtimes"),
    seatNumbers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }
    
    const showtime = await ctx.db.get(args.showtimeId);
    if (!showtime) {
      throw new Error("Showtime not found");
    }
    
    // Check if seats are available
    const bookedSeats = await ctx.db
      .query("bookings")
      .withIndex("by_showtime", (q) => q.eq("showtimeId", args.showtimeId))
      .filter((q) => q.eq(q.field("bookingStatus"), "confirmed"))
      .collect();
    
    const allBookedSeats = bookedSeats.flatMap(booking => booking.seatNumbers);
    const conflictingSeats = args.seatNumbers.filter(seat => allBookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      throw new Error(`Seats ${conflictingSeats.join(", ")} are already booked`);
    }
    
    const totalAmount = args.seatNumbers.length * showtime.price;
    const bookingDate = new Date().toISOString().split('T')[0];
    
    // Update available seats
    await ctx.db.patch(args.showtimeId, {
      availableSeats: showtime.availableSeats - args.seatNumbers.length,
    });
    
    return await ctx.db.insert("bookings", {
      userId,
      showtimeId: args.showtimeId,
      seatNumbers: args.seatNumbers,
      totalAmount,
      bookingStatus: "pending", // Changed to pending until payment is completed
      bookingDate,
    });
  },
});

export const getUserBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const showtime = await ctx.db.get(booking.showtimeId);
        if (!showtime) return null;
        
        const movie = await ctx.db.get(showtime.movieId);
        const theater = await ctx.db.get(showtime.theaterId);
        
        return {
          ...booking,
          showtime,
          movie,
          theater,
        };
      })
    );
    
    return bookingsWithDetails.filter(Boolean);
  },
});
