import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createPayment = mutation({
  args: {
    bookingId: v.id("bookings"),
    paymentMethod: v.string(), // "credit_card", "debit_card", "paypal", "apple_pay"
    cardNumber: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    cvv: v.optional(v.string()),
    cardholderName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // In a real app, you would integrate with a payment processor like Stripe
    // For demo purposes, we'll simulate payment processing
    const paymentSuccessful = Math.random() > 0.1; // 90% success rate

    if (!paymentSuccessful) {
      throw new Error("Payment failed. Please try again.");
    }

    const paymentId = await ctx.db.insert("payments", {
      bookingId: args.bookingId,
      userId,
      amount: booking.totalAmount,
      paymentMethod: args.paymentMethod,
      paymentStatus: "completed",
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentDate: new Date().toISOString(),
    });

    // Update booking status to confirmed with payment
    await ctx.db.patch(args.bookingId, {
      bookingStatus: "confirmed",
      paymentId,
    });

    return paymentId;
  },
});

export const getPaymentMethods = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // In a real app, you would fetch saved payment methods from the database
    // For demo purposes, return some sample methods
    return [
      {
        id: "card_1",
        type: "credit_card",
        last4: "4242",
        brand: "visa",
        isDefault: true,
      },
      {
        id: "card_2",
        type: "credit_card",
        last4: "5555",
        brand: "mastercard",
        isDefault: false,
      },
    ];
  },
});

export const getUserPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        const booking = await ctx.db.get(payment.bookingId);
        return {
          ...payment,
          booking,
        };
      })
    );

    return paymentsWithDetails;
  },
});
