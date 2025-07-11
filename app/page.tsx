"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";

export default function Home() {
  const [usuario,setUsuario] = useState("");
  const [password,setPassword] = useState("");
  const [producto,setProducto] = useState("");
  const [precio,setPrecio] = useState(0);
  const crearProducto = useMutation(api.functions.ventas.crearProducto);
  const crearUsuario = useMutation(api.functions.ventas.crearUsuario);
  const crearVenta = useMutation(api.functions.ventas.crearVenta);
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        Convex + Next.js
      </header>
      <main className="p-8 flex flex-col gap-16 justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Tiandanube con Convex</h1>
        <div className="p-8 flex flex-col gap-16 justify-center items-center w-full sm:w-[600px] rounded-2xl bg-black border-2 border-white text-white">
          <p className="text-3xl">Creando un Usuario</p>
          <button className="w-full sm:w-[250px] p-4 text-2xl select-none rounded-2xl bg-black border-2 border-white text-white hover:bg-gray-300 hover:text-black hover:border-black transition-all duration-150"
          onClick={async () => { let response = 
            await crearUsuario({
              nombreUsuario: "usuario1",
              password: "usuario1",
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
              cantidad: BigInt(1),
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
