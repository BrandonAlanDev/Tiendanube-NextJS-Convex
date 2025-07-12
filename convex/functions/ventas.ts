import { mutation} from '../_generated/server'
import { Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export const listarVentas = query({
  args: {
    limit: v.optional(v.number()), // cantidad por página (ej: 10)
  },
  handler: async (ctx, args) => {
    const ventas = await ctx.db
      .query("ventas")
      .order("desc") // ventas más recientes primero
      .take(args.limit ?? 20); // por defecto 20

    const resultado: {
      comprador: string;
      producto: string;
      precioUnitario: number;
      cantidad: bigint;
      total: number;
      fecha: string;
    }[] = [];

    for (const venta of ventas) {
      const usuario = await ctx.db.get(venta.idUsuario as Doc<"usuarios">["_id"]);
      const producto = await ctx.db.get(venta.idProducto as Doc<"productos">["_id"]);

      if (!usuario || !producto) continue;

      resultado.push({
        comprador: usuario.nombreUsuario,
        producto: producto.producto,
        precioUnitario: producto.precio,
        cantidad: venta.cantidad,
        total: producto.precio * Number(venta.cantidad),
        fecha: venta.fecha,
      });
    }

    return resultado;
  },
});

export const ventasPorMes = query({
  handler: async (ctx) => {
    const ventas = await ctx.db.query("ventas").collect();
    const productosCache = new Map();

    const now = new Date();
    const resumen: number[] = Array(13).fill(0); // 12 meses + total general
    const mesActual = now.getMonth();
    const añoActual = now.getFullYear();

    for (const venta of ventas) {
      const fecha = new Date(venta.fecha);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();

      // Solo últimos 12 meses
      const diferenciaMeses = (añoActual - año) * 12 + (mesActual - mes);
      if (diferenciaMeses < 0 || diferenciaMeses > 11) continue;

      // Obtener producto
      let producto = productosCache.get(venta.idProducto);
      if (!producto) {
        producto = await ctx.db.get(venta.idProducto as Id<"productos">);
        if (!producto) continue;
        productosCache.set(venta.idProducto, producto);
      }

      const totalVenta = producto.precio * Number(venta.cantidad);

      resumen[11 - diferenciaMeses] += totalVenta; // de más viejo a más nuevo
      resumen[12] += totalVenta; // total acumulado
    }

    return resumen; // [mes-1, mes-2, ..., mes-12, total]
  },
});

export const totalHistorico = query({
  handler: async (ctx) => {
    const ventas = await ctx.db.query("ventas").collect();
    const productosCache = new Map();
    let total = 0;

    for (const venta of ventas) {
      let producto = productosCache.get(venta.idProducto);
      if (!producto) {
        producto = await ctx.db.get(venta.idProducto as Id<"productos">);
        if (!producto) continue;
        productosCache.set(venta.idProducto, producto);
      }

      total += producto.precio * Number(venta.cantidad);
    }

    return total;
  },
});


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
