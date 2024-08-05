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
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    areasoli: "",
    solicita: "",
    edificio: "",
    descripcion: "",
    tipoMantenimiento: "",
    tipoTrabajo: "",
    tipoSolicitud: ""
  });

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
  }, [projectsLoaded, traerFolioInternoInforme, traerHistorialOrden]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValue(name, value, { shouldValidate: true });
  };

  const onSubmit = async () => {
    try {
      const informe = {
        Solicita: {
          nombre: formData.solicita,
          areaSolicitante: formData.areasoli,
          edificio: formData.edificio,
        },
        fecha: formData.fecha,
        tipoDeMantenimiento: formData.tipoMantenimiento,
        tipoDeTrabajo: formData.tipoTrabajo,
        tipoDeSolicitud: formData.tipoSolicitud,
        descripcion: formData.descripcion,
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
                name="fecha"
                className="w-full text-black p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Area solicitante:</Label>
              <AutocompleteInput
                index={0}
                value={formData.areasoli}
                onChange={(value) => handleAutocompleteChange("areasoli", value)}
                data={historialOrden}
                inputRefs={useRef([])}
                placeholder="Ingrese el área solicitante"
                fieldsToCheck={['areaSolicitante']}
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
                value={formData.solicita}
                onChange={(value) => handleAutocompleteChange("solicita", value)}
                data={historialOrden}
                inputRefs={useRef([])}
                placeholder="Ingrese quien solicita"
                fieldsToCheck={['nombre']}
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
                value={formData.edificio}
                onChange={(value) => handleAutocompleteChange("edificio", value)}
                data={historialOrden}
                inputRefs={useRef([])}
                placeholder="Ingrese el edificio"
                fieldsToCheck={['edificio']}
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
                name="tipoMantenimiento"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.tipoMantenimiento}
                onChange={handleChange}
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
                name="tipoTrabajo"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.tipoTrabajo}
                onChange={handleChange}
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
                name="tipoSolicitud"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.tipoSolicitud}
                onChange={handleChange}
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
            value={formData.descripcion}
            onChange={(value) => handleAutocompleteChange("descripcion", value)}
            data={historialOrden}
            inputRefs={useRef([])}
            placeholder="Ingrese una descripción"
            fieldsToCheck={['descripcionDelServicio']}
            inputProps={{
              type: "text",
              maxLength: 500,
              className: "w-full mb-5 resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
              // onBlur: () => setValue("descripcion", formData.descripcion, { shouldValidate: true })
            }}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
            type="submit"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};
