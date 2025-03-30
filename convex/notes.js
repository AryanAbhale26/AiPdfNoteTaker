import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const AddNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    if (record?.length === 0) {
      await ctx.db.insert("notes", {
        notes: args.notes,
        createdBy: args.createdBy,
        fileId: args.fileId,
      });
    } else {
      await ctx.db.patch(record[0]._id, {
        notes: args.notes,
      });
    }
  },
});

export const GetNotes = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();

    return result.length > 0 ? result[0].notes : null;
  },
});
