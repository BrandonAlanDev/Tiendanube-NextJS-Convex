import { mutation } from '../_generated/server'
import { v } from "convex/values";

export const guardarVenta = mutation({
  args: {
    idVenta: v.string(),
    producto: v.string(),
    precio: v.number(),
    fecha: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ventas", args);
  },
});