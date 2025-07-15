import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({

  usuarios: defineTable({
    email: v.string(),
    nombreUsuario: v.optional(v.string()),
    password: v.optional(v.string()),
    fecha: v.string(),
  }),
  productos: defineTable({
    producto: v.string(),
    precio: v.number(),
    stock: v.int64(),
    activo: v.boolean(),
  }),

  ventas: defineTable({
    idProducto: v.string(),
    idUsuario: v.string(),
    cantidad: v.int64(),
    fecha: v.string(),
  }),
});
