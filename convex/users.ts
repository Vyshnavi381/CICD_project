import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const requestPasswordReset = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true, message: "If the email exists, a reset link will be sent." };
    }

    // Generate a reset token (in production, use a proper token generator)
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    
    const resetExpiry = Date.now() + 3600000; // 1 hour from now

    // Store reset token in passwordResets table
    await ctx.db.insert("passwordResets", {
      email: args.email,
      token: resetToken,
      expiresAt: resetExpiry,
      used: false,
    });

    // In a real app, you would send an email here
    // For demo purposes, we'll just return the token
    console.log(`Password reset token for ${args.email}: ${resetToken}`);
    
    return { 
      success: true, 
      message: "Password reset instructions sent to your email.",
      // Remove this in production - only for demo
      resetToken 
    };
  },
});

export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Find valid reset token
    const resetRecord = await ctx.db
      .query("passwordResets")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .filter((q) => 
        q.and(
          q.eq(q.field("used"), false),
          q.gt(q.field("expiresAt"), Date.now())
        )
      )
      .first();

    if (!resetRecord) {
      throw new Error("Invalid or expired reset token");
    }

    // Mark token as used
    await ctx.db.patch(resetRecord._id, {
      used: true,
    });

    return { success: true, message: "Password reset token validated. Please complete reset in your auth provider." };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
