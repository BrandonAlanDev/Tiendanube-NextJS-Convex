import { mutation} from '../_generated/server'
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";

export const crearVenta = mutation({
  args: {
    idProducto: v.string(),
    idUsuario: v.string(),
    cantidad: v.int64(),
    fecha: v.string(),
  },
  handler: async (ctx, args) => {
    const producto = await ctx.db.get(args.idProducto as Id<"productos">);
    if (!producto) {
      return [404, "Producto no encontrado"];
    }

    const usuario = await ctx.db.get(args.idUsuario as Id<"usuarios">);
    if (!usuario) {
      return [404, "Usuario no encontrado"];
    }

    if (!producto.activo) {
      return [400, "Producto inactivo"];
    }

    if (producto.stock < args.cantidad) {
      return [400, "Stock insuficiente"];
    }

    // Crear la venta
    await ctx.db.insert("ventas", { ...args });

    // Actualizar el stock del producto
    await ctx.db.patch(args.idProducto as Id<"productos">, {
      stock: producto.stock - args.cantidad,
    });

    return [200, "Venta registrada correctamente"];
  },
});


export const crearUsuario = mutation({
  args: {
    nombreUsuario: v.string(),
    password: v.string(),
    fecha: v.string(),
  },
  handler: async (ctx, args) => {
    const existente = await ctx.db
      .query("usuarios")
      .filter((q) => q.eq(q.field("nombreUsuario"), args.nombreUsuario))
      .unique();

    if (existente) {
      return [409, "El nombre de usuario ya existe"];
    }

    await ctx.db.insert("usuarios", { ...args });
    return [200, "Usuario creado correctamente"];
  },
});


export const crearProducto = mutation({
  args: {
    producto: v.string(),
    precio: v.number(),
    stock: v.int64(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existente = await ctx.db
      .query("productos")
      .filter((q) => q.eq(q.field("producto"), args.producto))
      .unique();

    if (existente) {
      return [409, "El producto ya existe"];
    }

    await ctx.db.insert("productos", { ...args });
    return [200, "Producto creado correctamente"];
  },
});
