import React, { useRef, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useSoli } from "../context/SolicitudContext";
import { Button } from "../components/ui";

export const RegisterTecnicoPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
a
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [fechaAtencion, setFechaAtencion] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [items, setItems] = useState([
    {
      cantidad: "",
      unidad: "",
      descripcion: "",
      cantidadAcumulada: "",
      cantidadEntregada: "",
    },
  ]);

  const formRef = useRef(null);

  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const { createInfo, getIdsProyect, ids, getIdsProyectYAct } = useSoli();

  useEffect(() => {
    if (!projectsLoaded) {
      getIdsProyect()
        .then(() => {
          setProjectsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
    }
  }, [projectsLoaded, getIdsProyect]);

  const onSubmit = (data) => {
    console.log("Data to be submitted: ", data);
    formRef.current.submit();
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form method="post" action="http://localhost/Tutorial2_OpentbsWordPHP-master/ordenSoli.php" target="_blank">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">Orden de trabajo de mantenimiento a mobiliario e instalaciones</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label htmlFor="folio" className="block text-sm font-medium mb-1">
                No. de folio Interno:
              </label>
              <input
                type="number"
                id="folio"
                name="folio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                required
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
              <label htmlFor="folio" className="block text-sm font-medium mb-1">
                No. de folio Externo:
              </label>
              <input
                type="number"
                id="folio"
                name="folio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                required
              />
            </div>

          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Area solicitante:
              </label>
              <input
                type="text"
                id="areasoli"
                name="areasoli"
                {...register("areasoli")}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Solicita:
              </label>
              <input
                type="text"
                id="solicita"
                name="solicita"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                {...register("solicita")}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Edificio:
              </label>
              <input
                type="text"
                id="edificio"
                name="edificio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                {...register("edificio")}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Mantenimiento:</label>
              <select
                id="tipoMantenimiento"
                {...register("tipoMantenimiento")}
                name="tipoMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                required
              >
                <option value="">Seleccione un tipo de mantenimiento</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Trabajo:</label>
              <select
                id="tipoTrabajo"
                {...register("tipoTrabajo")}
                name="tipoTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                required
              >
                <option value="">Seleccione el tipo de trabajo</option>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Solicitud:</label>
              <select
                id="tipoSolicitud"
                {...register("tipoSolicitud")}
                name="tipoSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"

                required
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="Educativo">PC Educativo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción (servicio requerido):</label>
          </div>
          <textarea
            className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
            id="desc"
            name="desc"
            {...register("desc")}
          />
          
          <div className="botones">
            <Button type="submit" className="btn-primary">
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
