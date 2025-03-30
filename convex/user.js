import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
//import { mutation } from "./_generated/server" → mutation is a function that defines a database mutation (a function that modifies data) in Convex.

export const createUser = mutation({
  args: {
    email: v.string(),
    userName: v.string(),
    imageUrl: v.string(),
  },
  //ctx → The context object that gives access to the database (ctx.db) and other Convex functions.args → Contains the values passed to the mutation (i.e., email, username, imageUrl).
  handler: async (ctx, args) => {
    // Check if user already exists using .first() for better performance
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    // If user doesn't exist, insert a new record
    if (!user) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.userName,
        imageUrl: args.imageUrl,
        upgrade: false,
      });
      return "Inserted New User.";
    }

    return "User Already Exists.";
  },
});

export const userUpgradePlan = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .collect();
    if (result) {
      await ctx.db.patch(result[0]._id, { upgrade: true });
      return "success";
    }
    return "error";
  },
});

export const getUserData = query({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    return user || null;
  },
});
