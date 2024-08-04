import React, { useRef, useState, useEffect } from "react";
import "../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useOrden } from "../context/ordenDeTrabajoContext";
import { useNavigate } from "react-router-dom";
import "../css/Animaciones.css";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import Swal from "sweetalert2";
import { GridContainer, Label, Title } from "../components/ui";

export const RegisterTecnicoPage = () => {
  const navigate = useNavigate();

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

  const [areasoli, setAreasoli] = useState("");
  const [solicita, setSolicita] = useState("");
  const [edificio, setEdificio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const inputRef = useRef([]);

  const { crearOrdenTrabajo, traerFolioInternoInforme, miFolioInternoInfo, traerHistorialOrden, historialOrden } = useOrden();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await traerFolioInternoInforme();
        await traerHistorialOrden();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!projectsLoaded) {
      fetchData();
      setProjectsLoaded(true);
    }
  }, [projectsLoaded, traerFolioInternoInforme, traerHistorialOrden, miFolioInternoInfo, historialOrden]);

  const onSubmit = async (data) => {
    try {
      const informe = {
        Solicita: {
          nombre: solicita,
          areaSolicitante: areasoli,
          edificio,
        },
        fecha,
        tipoDeMantenimiento: data.tipoMantenimiento,
        tipoDeTrabajo: data.tipoTrabajo,
        tipoDeSolicitud: data.tipoSolicitud,
        descripcion,
      };
      console.log("Datos del formulario:", informe);

      const res = await crearOrdenTrabajo(informe);
      if (res) {
        Swal.fire({
          title: "Completado!",
          text: "Registro Exitoso",
          icon: "success",
          confirmButtonText: "Cool",
        });
      }
      navigate('/tecnico/orden');
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title>Orden De Trabajo De Mantenimiento A Mobiliario E Instalaciones</Title>
          <GridContainer>
            <div>
              <Label>No. de folio Externo:</Label>
              <input
                type="text"
                id="folio"
                name="folio"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                value={miFolioInternoInfo || ""}
                disabled
              />
            </div>
            <div></div>
            <div>
              <Label>Selecciona la fecha:</Label>
              <input
                type="date"
                id="fechaOrden"
                name="fechaOrden"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Area solicitante:</Label>
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
                  maxLength: 500,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
            <div>
              <Label>Solicita:</Label>
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
                  maxLength: 500,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
            <div>
              <Label>Edificio:</Label>
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
                  maxLength: 500,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                }}
              />
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Tipo de Mantenimiento:</Label>
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
              <Label>Tipo de Trabajo:</Label>
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
              <Label>Tipo de Solicitud:</Label>
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
          </GridContainer>
          <Label>Descripción (servicio requerido)</Label>
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
              maxLength: 500,
              className: "w-full mb-5 resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
            }}
          />
          <input name="descripcion" id="descripcion" type="hidden" value={descripcion} />
          <div className="flex items-center justify-center">
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
