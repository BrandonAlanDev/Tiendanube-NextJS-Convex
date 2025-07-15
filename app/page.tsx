"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card } from "@/components/ui/card";
import type { ChartOptions, ChartData } from "chart.js";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const [usuario,setUsuario] = useState("");
  const [password,setPassword] = useState("");
  const [producto,setProducto] = useState("");
  const [precio,setPrecio] = useState(0);
  const crearProducto = useMutation(api.functions.ventas.crearProducto);
  const crearUsuario = useMutation(api.functions.ventas.crearUsuario);
  const crearVenta = useMutation(api.functions.ventas.crearVenta);
  const ventas = useQuery(api.functions.ventas.listarVentas, { limit: 10 });
  const ventasMeses = useQuery(api.functions.ventas.ventasPorMes);
  const { isSignedIn, user } = useUser();

  if (ventas === undefined) return <p className="text-white">Cargando ventas...</p>;
  if (ventasMeses === undefined) return <p className="text-white">Cargando ventas por mes...</p>;

  return (
    <>
      <header className="sticky top-0 z-10 bg-black p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center text-white">
      {isSignedIn ? (
        <>
          <p>Hola, {user?.firstName}</p>
          <UserButton />
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
      </header>
      <main className="p-8 flex flex-col gap-16 justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Tiandanube con Convex</h1>
        <div className="p-8 flex flex-col gap-8 justify-center items-center w-full sm:w-[600px] rounded-2xl bg-black border-2 border-white text-white overflow-x-auto">
          <h2 className="text-2xl font-bold text-white">Últimas Ventas</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><p className="text-white text-md">Comprador</p></TableHead>
                <TableHead><p className="text-white text-md">Producto</p></TableHead>
                <TableHead><p className="text-white text-md">Precio</p></TableHead>
                <TableHead><p className="text-white text-md">Cantidad</p></TableHead>
                <TableHead><p className="text-white text-md">Total</p></TableHead>
                <TableHead><p className="text-white text-md">Fecha</p></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta, i) => (
                <TableRow key={i}>
                  <TableCell>{venta.comprador}</TableCell>
                  <TableCell>{venta.producto}</TableCell>
                  <TableCell>${venta.precioUnitario}</TableCell>
                  <TableCell>{venta.cantidad}</TableCell>
                  <TableCell>${venta.total}</TableCell>
                  <TableCell>
                    {new Date(venta.fecha).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <GraficoVentasMensuales/>
        
        <div className="p-8 flex flex-col gap-16 justify-center items-center w-full sm:w-[600px] rounded-2xl bg-black border-2 border-white text-white">
          <p className="text-3xl">Creando un Usuario</p>
          <button className="w-full sm:w-[250px] p-4 text-2xl select-none rounded-2xl bg-black border-2 border-white text-white hover:bg-gray-300 hover:text-black hover:border-black transition-all duration-150"
          onClick={async () => { let response = 
            await crearUsuario({
              clerkId: "1",
              email: "brandoncarabajal@gmail.com",
              nombreUsuario: "BrandonAlanDev",
              password: "qweQWE123",
              fecha: new Date().toISOString(),
            })
          window.alert(response);
          }
          }
          >
            Crear usuario
          </button>

        </div>
        <div className="p-8 flex flex-col gap-16 justify-center items-center w-full sm:w-[600px] rounded-2xl bg-black border-2 border-white text-white">
          <p className="text-3xl">Creando un Producto</p>
          <button className="w-full sm:w-[250px] p-4 text-2xl select-none rounded-2xl bg-black border-2 border-white text-white hover:bg-gray-300 hover:text-black hover:border-black transition-all duration-150"
          onClick={async () => { let response = 
            await crearProducto({
              producto: "Producto1",
              precio: 2500,
              stock: BigInt(100),
              activo: true,
            })
          window.alert(response);
          }
          }
          >
            Insertar Producto
          </button>

        </div>
        <div className="p-8 flex flex-col gap-16 justify-center items-center w-full sm:w-[600px] rounded-2xl bg-black border-2 border-white text-white">
          <p className="text-3xl">Creando una venta</p>
          <button className="w-full sm:w-[250px] p-4 text-2xl select-none rounded-2xl bg-black border-2 border-white text-white hover:bg-gray-300 hover:text-black hover:border-black transition-all duration-150"
          onClick={async () => { let response = 
            await crearVenta({
              idProducto: "jd7c2g1frmj8xyp3wby3n8y1mn7khvcr",
              idUsuario: "jh7a4486d1zx2nkyxjw117pehs7kgq50",
              cantidad: BigInt(5),
              fecha: new Date().toISOString(),
            })
          window.alert(response);
          }
          }
          >
            Insertar Venta Test
          </button>

        </div>
        <Content />
      </main>
    </>
  );
}

function Content() {
  /*
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);
  
  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
      <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }
  */
  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md h-28 overflow-auto">
      <a href={href} className="text-sm underline hover:no-underline">
        {title}
      </a>
      <p className="text-xs">{description}</p>
    </div>
  );
}

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function GraficoVentasMensuales() {
  const resumen = useQuery(api.functions.ventas.ventasPorMes);

  if (resumen === undefined) return <p className="text-white">Cargando gráfico...</p>;
  if (resumen.length === 0) return <p className="text-white">No hay ventas registradas.</p>;

  const total = resumen[12]; // total acumulado
  const datosMensuales = resumen.slice(0, 12);

  // Generar etiquetas dinámicas de los últimos 12 meses
  const labels = Array.from({ length: 12 }, (_, i) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - (11 - i));
    return `${fecha.toLocaleString("default", { month: "short" })} ${fecha.getFullYear()}`;
  });

  const data: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: "Ventas por mes",
        data: datosMensuales,
        fill: true,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "#0ea5e9",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#334155" },
      },
      y: {
        ticks: {
          color: "white",
          callback: function (tickValue: string | number) {
            return `$${Number(tickValue).toLocaleString()}`;
          },
        },
        grid: { color: "#334155" },
      },
    },
  };

  return (
    <Card className="bg-black border-white border-2 p-6 text-white w-full sm:w-[600px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas últimos 12 meses</h2>
      <Line data={data} options={options} />
      <p className="mt-4 text-right text-lg">
        Total acumulado: <strong>${total.toLocaleString()}</strong>
      </p>
    </Card>
  );
}