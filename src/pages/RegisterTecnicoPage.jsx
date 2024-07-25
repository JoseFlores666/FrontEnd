import React, { useRef, useState, useEffect } from "react";
import "../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useSoli } from "../context/SolicitudContext";
import "../css/Animaciones.css";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import Swal from "sweetalert2";

export const RegisterTecnicoPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [fechaOrden, setFechaOrden] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [areasoli, setAreasoli] = useState("");
  const [solicita, setSolicita] = useState("");
  const [edificio, setEdificio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const inputRef = useRef([]);
  const { createInfo, myFolioInternoInfo, mensaje, traeFolioInternoInforme, historialOrden, traeHistorialOrden } = useSoli();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await traeFolioInternoInforme();
        console.log("myFolioInternoInfo after fetch:", myFolioInternoInfo);

        await traeHistorialOrden();
        console.log("historialOrden after fetch:", historialOrden);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!projectsLoaded) {
      fetchData();
      setProjectsLoaded(true);
    }
  }, [projectsLoaded, traeFolioInternoInforme, traeHistorialOrden, myFolioInternoInfo, historialOrden]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        folio: data.folio,
        fechaOrden: fechaOrden,
        folioExterno: data.folioExterno,
        areasoli: areasoli,
        solicita: solicita,
        edificio: edificio,
        tipoMantenimiento: data.tipoMantenimiento,
        tipoTrabajo: data.tipoTrabajo,
        tipoSolicitud: data.tipoSolicitud,
        descripcion: descripcion,
      };

      await createInfo(formData);

      if (mensaje) {
        Swal.fire({
          title: "Completado!",
          text: "Registro Exitoso",
          icon: "success",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 text-black shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl  font-bold text-center text-black">Orden De Trabajo De Mantenimiento A Mobiliario E Instalaciones</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-base font-medium mb-1">No. de folio Externo:</label>
              <input
                type="text"
                id="folio"
                name="folio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                value={myFolioInternoInfo || ""}
                disabled
              />
            </div>
            <div></div>
            <div>
              <label className="block text-base font-medium mb-1">Selecciona la fecha:</label>
              <input
                type="date"
                id="fechaOrden"
                name="fechaOrden"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fechaOrden}
                onChange={(e) => setFechaOrden(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-base font-medium mb-1">Area solicitante:</label>
              <AutocompleteInput
                index={0}
                value={areasoli}
                onChange={(newValue) => setAreasoli(newValue)}
                data={historialOrden}
                recentSuggestions={recentSuggestions}
                setRecentSuggestions={setRecentSuggestions}
                inputRefs={inputRef}
                placeholder="Ingrese el área solicitante"
                fieldsToCheck={['areaSolicitante']}
                ConvertirAInput={true}
                inputProps={{
                  id: "areasoli",
                  name: "areasoli",
                  type: "text",
                  maxLength: 200,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Solicita:</label>
              <AutocompleteInput
                index={1}
                value={solicita}
                onChange={(newValue) => setSolicita(newValue)}
                data={historialOrden}
                recentSuggestions={recentSuggestions}
                setRecentSuggestions={setRecentSuggestions}
                inputRefs={inputRef}
                placeholder="Ingrese quien solicita"
                fieldsToCheck={['nombre']}
                ConvertirAInput={true}
                inputProps={{
                  type: "text",
                  maxLength: 200,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Edificio:</label>
              <AutocompleteInput
                index={2}
                value={edificio}
                onChange={(newValue) => setEdificio(newValue)}
                data={historialOrden}
                recentSuggestions={recentSuggestions}
                setRecentSuggestions={setRecentSuggestions}
                inputRefs={inputRef}
                placeholder="Ingrese el edificio"
                fieldsToCheck={['edificio']}
                ConvertirAInput={true}
                inputProps={{
                  id: "edificio",
                  name: "edificio",
                  type: "text",
                  maxLength: 200,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-base font-medium mb-1">Tipo de Mantenimiento:</label>
              <select
                id="tipoMantenimiento"
                {...register("tipoMantenimiento", { required: true })}
                name="tipoMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione un tipo de mantenimiento</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Instalaciones">Instalaciones</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Tipo de Trabajo:</label>
              <select
                id="tipoTrabajo"
                {...register("tipoTrabajo", { required: true })}
                name="tipoTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione el tipo de trabajo</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Tipo de Solicitud:</label>
              <select
                id="tipoSolicitud"
                {...register("tipoSolicitud", { required: true })}
                name="tipoSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium mb-1">Descripción:</label>
            <AutocompleteInput
              index={3}
              value={descripcion}
              onChange={(newValue) => setDescripcion(newValue)}
              data={historialOrden}
              recentSuggestions={recentSuggestions}
              setRecentSuggestions={setRecentSuggestions}
              inputRefs={inputRef}
              placeholder="Ingrese una descripción"
              fieldsToCheck={['descripcionDelServicio']}
              inputProps={{
                type: "text",
                maxLength: 200,
                className: "w-full resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
              }}
            />
            <input name="descripcion" id="descripcion" type="hidden" value={descripcion} />
          </div>
          <div className="botones">
            <button
              type="submit"
          
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
