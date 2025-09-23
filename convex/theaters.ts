import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listTheaters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("theaters").collect();
  },
});

export const addTheater = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    totalSeats: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("theaters", args);
  },
});
