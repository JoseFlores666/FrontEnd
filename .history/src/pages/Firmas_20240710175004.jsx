import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { firmasSchema } from "../schemas/Firmas"; // Asegúrate de tener definido este esquema en tu proyecto
import "../css/solicitud.css";
import { useSoli } from "../context/SolicitudContext";
import "../css/Animaciones.css";

export const Firmas = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firmasSchema),
  });

  const { editarFirmas, getFirmas, nombresFirmas } = useSoli();
  const [esperarFirmas, setEsperarFirmas] = useState(false);

  useEffect(() => {
    const llamaFirmas = async () => {
      try {
        await getFirmas();
        setEsperarFirmas(true);
      } catch (error) {
        console.error("Error al consultar las firmas:", error);
        Swal.fire("Error al guardar los datos", "", "error");
      }
    };
    if (!esperarFirmas) {
      llamaFirmas();
      llenadoFirmas();
    }
  }, [getFirmas, esperarFirmas]);

  const llenadoFirmas = () => {
    if (nombresFirmas.length > 0) {
      const { solicitud, revision, validacion, autorizacion } = nombresFirmas[0];
      setValue("solicitante", solicitud);
      setValue("jefeInmediato", revision);
      setValue("direccion", validacion);
      setValue("rectoria", autorizacion);
    }
  };

  const guardarDatos = async (data) => {
    console.log("Datos guardados:", data);
    try {
      await editarFirmas(data);
      setEsperarFirmas(true)
      Swal.fire("Datos guardados", "", "success");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Swal.fire("Error al guardar los datos", "", "error");
    }
  };

  return (
    <div className="flex items-center justify-center mx-auto max-w-7xl p-4 text-black" style={{ height: '90vh' }}>
      <div className="bg-white p-6 rounded-lg shadow-md border border-blackclassName="slide-down"">
        <div className="flex items-center justify-center mb-6 w-full h-11 bg-green-600">
          <h1 className="text-2xl font-bold text-white text-center">Editar Nombres</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit(guardarDatos)} >
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8 text-center">
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="solicitud" className="block text-lg font-bold">Solicitud</label>
                <textarea
                  type="text"
                  className="w-full text-center p-3 resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  id="solicitud"
                  {...register("solicitante")}
                />
                {errors.solicitante && (
                  <p className="text-red-500">{errors.solicitante.message}</p>
                )}
              </div>

              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="JefeInmediato" className="block text-lg font-bold">Revisión</label>
                <textarea
                  type="text"
                  className="w-full text-center p-3 resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  id="JefeInmediato"
                  {...register("jefeInmediato")}
                />
                {errors.jefeInmediato && (
                  <p className="text-red-500">{errors.jefeInmediato.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8 text-center">
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="Validacion" className="block text-lg font-bold">Validación</label>
                <textarea
                  type="text"
                  className="w-full text-center p-3 resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  id="Validacion"
                  {...register("direccion")}
                />
                {errors.direccion && (
                  <p className="text-red-500">{errors.direccion.message}</p>
                )}
              </div>
              <div className="mb-4 gap-8 mx-10">
                <label htmlFor="Autorizo" className="block text-lg font-bold">Autorizó</label>
                <textarea
                  type="text"
                  className="w-full text-center p-3 resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  id="Autorizo"
                  {...register("rectoria")}
                />
                {errors.rectoria && (
                  <p className="text-red-500">{errors.rectoria.message}</p>
                )}
              </div>
            </div>


            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 px-6 py-3 rounded-md border border-black"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};