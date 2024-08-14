import React, { useRef, useState, useEffect } from "react";
import "../../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useOrden } from "../../context/ordenDeTrabajoContext";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/Animaciones.css";
import { AutocompleteInput } from "../../components/ui/AutocompleteInput";
import Swal from "sweetalert2";
import { GridContainer, Label, Title } from "../../components/ui";
import { registerTecnicoPageSchema } from '../../schemas/RegisterTecnicoPage'
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterTecnicoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editar = new URLSearchParams(location.search).get("editar");

  const { register, handleSubmit, setValue, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(registerTecnicoPageSchema),
  });

  const [fecha, setFecha] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const [informe, setInforme] = useState({
    fecha: "",
    areasoli: "",
    solicita: "",
    edificio: "",
    tipoDeMantenimiento: "",
    tipoDeTrabajo: "",
    tipoDeSolicitud: "",
    descripcion: ""
  });

  const [recentSuggestions, setRecentSuggestions] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [cargandoInforme, setCargandoInforme] = useState(editar);
  const showBackButton = editar;
  const titleText = editar ? "Actualizar Orden de trabajo" : "Orden De Trabajo De Mantenimiento A Mobiliario E Instalaciones";

  const inputRef = useRef([]);

  const {
    crearOrdenTrabajo,
    traerFolioInternoInforme,
    miFolioInternoInfo,
    traerHistorialOrden,
    historialOrden,
    traerUnaInfo,
    unaInfo,
    actualizarMyInforme
  } = useOrden();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const today = new Date().toISOString().split("T")[0];
        setFecha(today);

        await traerHistorialOrden();
        await traerFolioInternoInforme();

        setProjectsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!projectsLoaded && !editar) {
      fetchData();
    }
  }, [projectsLoaded, editar, traerFolioInternoInforme, traerHistorialOrden]);

  useEffect(() => {
    const traerInfo = async () => {
      try {
        await traerUnaInfo(id);
        if (unaInfo && Object.keys(unaInfo).length > 0) {
          setCargandoInforme(false);
          llenar();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id && cargandoInforme) {
      traerInfo();
    }
  }, [id, cargandoInforme, editar, traerUnaInfo, unaInfo]);

  useEffect(() => {
    if (miFolioInternoInfo && !editar) {
      setValue("folio", miFolioInternoInfo);
    }
  }, [miFolioInternoInfo, editar, setValue]);

  useEffect(() => {
    if (unaInfo && Object.keys(unaInfo).length > 0) {
      llenar();
    }
  }, [unaInfo]);

  const llenar = () => {
    if (id && editar) {
      setValue("folio", unaInfo?.informe?.folio || "");
      setFecha(unaInfo.informe.fecha ? unaInfo.informe.fecha.split("T")[0] : "");
      setInforme({
        fecha: unaInfo.informe.fecha ? unaInfo.informe.fecha.split("T")[0] : "",
        areasoli: unaInfo.informe.Solicita ? unaInfo.informe.Solicita.areaSolicitante : "",
        solicita: unaInfo.informe.Solicita ? unaInfo.informe.Solicita.nombre : "",
        edificio: unaInfo.informe.Solicita ? unaInfo.informe.Solicita.edificio : "",
        tipoDeMantenimiento: unaInfo.informe.tipoDeMantenimiento || "",
        tipoDeTrabajo: unaInfo.informe.tipoDeTrabajo || "",
        tipoDeSolicitud: unaInfo.informe.tipoDeSolicitud || "",
        descripcion: unaInfo.informe.descripcion || ""
      });
    }
  };

  const limpiar = () => {
    setValue("folio", "");
    setFecha("");
    setInforme({
      fecha: "",
      areasoli: "",
      solicita: "",
      edificio: "",
      tipoDeMantenimiento: "",
      tipoDeTrabajo: "",
      tipoDeSolicitud: "",
      descripcion: ""
    });
  };

  const handleFormSubmit = async () => {
    try {
      let res;
      if (id && editar) {
        res = await actualizarMyInforme(id, informe);
      } else {
        res = await crearOrdenTrabajo(informe);
      }

      if (res && res.data?.mensaje) {
        Swal.fire({
          title: id && editar ? "Datos actualizados" : "Orden creada",
          text: res.data?.mensaje,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate('/tecnico/orden');
        });
        limpiar();
      } else {
        Swal.fire("Error", res?.error || "Error desconocido", "error");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      Swal.fire("Error", "Ocurrió un error al guardar la información", "error");
    }
  };

  const handleFechaChange = (e) => {
    const newFecha = e.target.value;
    setFecha(newFecha);
    setInforme((prev) => ({
      ...prev,
      fecha: newFecha,
    }));
    trigger("fecha"); // Disparar validación manualmente
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title showBackButton={showBackButton}>
            {titleText}
          </Title>
          <GridContainer>
            <div>
              <Label>No. de folio Externo:</Label>
              <input
                type="text"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folio")}
                disabled
              />
            </div>
            <div>
            </div>
            <div>
              <Label>Selecciona la fecha:</Label>
              <input
                type="date"
                id="fechaOrden"
                name="fecha"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fecha}
                {...register("fecha")}
                onChange={handleFechaChange}
              />
              {errors.fecha && <p className="text-red-500">{errors.fecha.message}</p>}
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Area solicitante:</Label>
              <AutocompleteInput
                index={0}
                value={informe.areasoli}
                onChange={(newValue) => setInforme((prev) => ({ ...prev, areasoli: newValue }))}
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
                  onBlur: () => setValue(`areasoli`, informe.areasoli, { shouldValidate: true })
                }}
              />
              {errors.areasoli && <p className="text-red-500">{errors.areasoli.message}</p>}
            </div>
            <div>
              <Label>Solicita:</Label>
              <AutocompleteInput
                index={1}
                value={informe.solicita}
                onChange={(newValue) =>
                  setInforme((prev) => ({ ...prev, solicita: newValue }))
                }
                data={historialOrden}
                recentSuggestions={recentSuggestions}
                setRecentSuggestions={setRecentSuggestions}
                inputRefs={inputRef}
                placeholder="Ingrese quien solicita"
                fieldsToCheck={['nombre']}
                ConvertirAInput={true}
                inputProps={{
                  id: "solicita",
                  name: "solicita",
                  type: "text",
                  maxLength: 500,
                  className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                  onBlur: () => setValue(`solicita`, informe.solicita, { shouldValidate: true })
                }}
              />
              {errors.solicita && <p className="text-red-500">{errors.solicita.message}</p>}
            </div>
            <div>
              <Label>Edificio:</Label>
              <AutocompleteInput
                index={2}
                value={informe.edificio}
                onChange={(newValue) =>
                  setInforme((prev) => ({ ...prev, edificio: newValue }))
                }
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
                  onBlur: () => setValue(`edificio`, informe.edificio, { shouldValidate: true })
                }}
              />


              {errors.edificio && <p className="text-red-500">{errors.edificio.message}</p>}
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Tipo de Mantenimiento:</Label>
              <select
                id="tipoMantenimiento"
                {...register("tipoDeMantenimiento", { required: true })}
                name="tipoDeMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={informe.tipoDeMantenimiento}
                onChange={(e) => {
                  setInforme({ ...informe, tipoDeMantenimiento: e.target.value });
                  setValue("tipoDeMantenimiento", e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Seleccione un tipo de mantenimiento</option>
                <option value="Mobiliario">Mobiliario</option>
                <option value="Instalaciones">Instalaciones</option>
              </select>
              {errors.tipoDeMantenimiento && (
                <p className="text-red-500">{errors.tipoDeMantenimiento.message}</p>
              )}
            </div>
            <div>
              <Label>Tipo de Trabajo:</Label>
              <select
                id="tipoTrabajo"
                {...register("tipoDeTrabajo", { required: true })}
                name="tipoDeTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={informe.tipoDeTrabajo}
                onChange={(e) => {
                  setInforme((prev) => ({
                    ...prev,
                    tipoDeTrabajo: e.target.value,
                  }));
                  setValue("tipoDeTrabajo", e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Seleccione el tipo de trabajo</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
              {errors.tipoDeTrabajo && (
                <p className="text-red-500">{errors.tipoDeTrabajo.message}</p>
              )}
            </div>
            <div>
              <Label>Tipo de Solicitud:</Label>
              <select
                id="tipoSolicitud"
                {...register("tipoDeSolicitud", { required: true })}
                name="tipoDeSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={informe.tipoDeSolicitud}
                onChange={(e) => {
                  setInforme((prev) => ({
                    ...prev,
                    tipoDeSolicitud: e.target.value,
                  }));
                  setValue("tipoDeSolicitud", e.target.value, { shouldValidate: true });
                }}
              >
                <option value="">Seleccione el tipo de solicitud</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
              {errors.tipoDeSolicitud && (
                <p className="text-red-500">{errors.tipoDeSolicitud.message}</p>
              )}
            </div>
          </GridContainer>
          <Label>Descripción (servicio requerido)</Label>
          <AutocompleteInput
            index={3}
            value={informe.descripcion}
            onChange={(newValue) =>
              setInforme((prev) => ({ ...prev, descripcion: newValue }))
            }
            data={historialOrden}
            recentSuggestions={recentSuggestions}
            setRecentSuggestions={setRecentSuggestions}
            inputRefs={inputRef}
            placeholder="Ingrese una descripción"
            fieldsToCheck={['descripcionDelServicio']}
            inputProps={{
              type: "text",
              maxLength: 500,
              className: "w-full resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
              onBlur: () => setValue(`descripcion`, informe.descripcion, { shouldValidate: true })
            }}
          />
          {errors.descripcion && (
            <p className="text-red-500">{errors.descripcion.message}</p>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
            >
              {editar ? "Actualizar cambios" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
