import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SubiendoImagenes from "../components/ui/SubiendoImagenes";
import { useSoli } from "../context/SolicitudContext";
import { Button } from "../components/ui";

export const RegisterTecnicoPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const formRef = useRef(null);
  const subiendoImagenesRef = useRef(null);
  const { createInfo, getIdsProyect, myFolioInternoInfo, traeFolioInternoInforme } = useSoli();

  useEffect(() => {
    getIdsProyect()
      .then(() => { })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [getIdsProyect]);

  useEffect(() => {
    const llenaFolio = async () => {
      try {
        await traeFolioInternoInforme();
      } catch (error) {
        console.error("Error fetching folio:", error);
      }
    };
    llenaFolio();
  }, [traeFolioInternoInforme]);

  useEffect(() => {
    if (myFolioInternoInfo) {
      setValue("folio", myFolioInternoInfo || "");
    }
  }, [myFolioInternoInfo]);

  const onSubmit = async (data) => {
    data.fecha = fecha;
    const imagenes = subiendoImagenesRef.current ? subiendoImagenesRef.current.getFiles() : [];
    data.imagenes = imagenes;
    console.log("Data to be submitted: ", data);

    try {
      await createInfo(data);
      // Lógica después de enviar exitosamente el formulario
    } catch (error) {
      console.error("Error creating info:", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">
              Orden de trabajo de mantenimiento a mobiliario e instalaciones
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label htmlFor="folio" className="block text-sm font-medium mb-1">
                No. de folio Interno:
              </label>
              <input
                type="text"
                id="folio"
                name="folio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selecciona la fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fecha || ""}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="folioExterno" className="block text-sm font-medium mb-1">
                No. de folio Externo:
              </label>
              <input
                type="number"
                id="folioExterno"
                name="folioExterno"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folioExterno", { required: true })}
              />
              {errors.folioExterno && <span className="text-red-500">Este campo es requerido</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Area solicitante:</label>
              <input
                type="text"
                id="areasoli"
                name="areasoli"
                {...register("areasoli", { required: true })}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.areasoli && <span className="text-red-500">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Solicita:</label>
              <input
                type="text"
                id="solicita"
                name="solicita"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("solicita", { required: true })}
              />
              {errors.solicita && <span className="text-red-500">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Edificio:</label>
              <input
                type="text"
                id="edificio"
                name="edificio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("edificio", { required: true })}
              />
              {errors.edificio && <span className="text-red-500">Este campo es requerido</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Mantenimiento:</label>
              <select
                id="tipoMantenimiento"
                {...register("tipoMantenimiento", { required: true })}
                name="tipoMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione un tipo de mantenimiento</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
              {errors.tipoMantenimiento && <span className="text-red-500">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Trabajo:</label>
              <select
                id="tipoTrabajo"
                {...register("tipoTrabajo", { required: true })}
                name="tipoTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione el tipo de trabajo</option>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
              {errors.tipoTrabajo && <span className="text-red-500">Este campo es requerido</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solicitud:</label>
              <select
                id="tipoSolicitud"
                {...register("tipoSolicitud", { required: true })}
                name="tipoSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="Educativo">PC Educativo</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.tipoSolicitud && <span className="text-red-500">Este campo es requerido</span>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Objetivo:</label>
            <textarea
              id="objetivo"
              name="objetivo"
              {...register("objetivo", { required: true })}
              rows="4"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {errors.objetivo && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Observaciones:</label>
            <textarea
              id="observaciones"
              name="observaciones"
              {...register("observaciones")}
              rows="4"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              {...register("descripcion", { required: true })}
              rows="4"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {errors.descripcion && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Atiende:</label>
            <textarea
              id="atiende"
              name="atiende"
              {...register("atiende", { required: true })}
              rows="4"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {errors.atiende && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Elaboró:</label>
            <textarea
              id="elaboro"
              name="elaboro"
              {...register("elaboro", { required: true })}
              rows="4"
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
            {errors.elaboro && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Proyecto:</label>
            <select
              id="proyecto"
              name="proyecto"
              {...register("proyecto", { required: true })}
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione un proyecto</option>
              {/* Lógica para mapear proyectos */}
            </select>
            {errors.proyecto && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Actividad:</label>
            <select
              id="actividad"
              name="actividad"
              {...register("actividad", { required: true })}
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccione una actividad</option>
              {/* Lógica para mapear actividades */}
            </select>
            {errors.actividad && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Documentación:</label>
            <input
              type="file"
              id="documentacion"
              name="documentacion"
              {...register("documentacion", { required: true })}
              className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.documentacion && <span className="text-red-500">Este campo es requerido</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Subiendo imágenes:</label>
            <SubiendoImagenes ref={subiendoImagenesRef} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-md">
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterTecnicoPage;
