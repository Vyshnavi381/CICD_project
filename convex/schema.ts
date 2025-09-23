import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  movies: defineTable({
    title: v.string(),
    description: v.string(),
    genre: v.string(),
    duration: v.number(), // in minutes
    rating: v.string(),
    posterUrl: v.string(),
    releaseDate: v.string(),
    isActive: v.boolean(),
  }),
  
  theaters: defineTable({
    name: v.string(),
    location: v.string(),
    totalSeats: v.number(),
  }),
  
  showtimes: defineTable({
    movieId: v.id("movies"),
    theaterId: v.id("theaters"),
    showDate: v.string(),
    showTime: v.string(),
    price: v.number(), // in INR
    availableSeats: v.number(),
  }).index("by_movie", ["movieId"])
    .index("by_theater", ["theaterId"])
    .index("by_date", ["showDate"]),
  
  bookings: defineTable({
    userId: v.id("users"),
    showtimeId: v.id("showtimes"),
    seatNumbers: v.array(v.string()),
    totalAmount: v.number(), // in INR
    bookingStatus: v.string(), // "pending", "confirmed", "cancelled"
    bookingDate: v.string(),
    paymentId: v.optional(v.id("payments")),
  }).index("by_user", ["userId"])
    .index("by_showtime", ["showtimeId"]),

  payments: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(), // in INR
    paymentMethod: v.string(),
    paymentStatus: v.string(), // "pending", "completed", "failed", "refunded"
    transactionId: v.string(),
    paymentDate: v.string(),
  }).index("by_user", ["userId"])
    .index("by_booking", ["bookingId"]),

  passwordResets: defineTable({
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
  }).index("by_email", ["email"])
    .index("by_token", ["token"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
