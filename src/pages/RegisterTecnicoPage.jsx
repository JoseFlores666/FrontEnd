import React, { useRef, useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../css/solicitud.css";
import { useForm } from "react-hook-form";
import { useSoli } from "../context/SolicitudContext";
import "../css/Animaciones.css";
import SubiendoImagenes from "../components/ui/SubiendoImagenes";
import { Button } from "../components/ui";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import Swal from "sweetalert2";
import imgPDF from '../img/imagenPDF.png';
import imgWord from '../img/imagenWord.png';


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

  const [isOpen, setIsOpen] = useState(false);
  const [clickedPDF, setClickedPDF] = useState(false);
  const [areasoli, setAreasoli] = useState("");
  const [solicita, setSolicita] = useState("");
  const [edificio, setEdificio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  const inputRef = useRef([]);
  const subiendoImagenesRef = useRef(null);
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



  const handleToggleModal = (event) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleCloseModal = (event) => {
    event.preventDefault();
    setIsOpen(false);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("folio", data.folio);
      formData.append("fechaOrden", fechaOrden);
      formData.append("folioExterno", data.folioExterno);
      formData.append("areasoli", areasoli); // Usando el estado local `areasoli`
      formData.append("solicita", solicita); // Usando el estado local `solicita`
      formData.append("edificio", edificio); // Usando el estado local `edificio`
      formData.append("tipoMantenimiento", data.tipoMantenimiento);
      formData.append("tipoTrabajo", data.tipoTrabajo);
      formData.append("tipoSolicitud", data.tipoSolicitud);
      formData.append("descripcion", descripcion); // Usando el estado local `descripcion`

      const files = subiendoImagenesRef.current.getFiles();
      for (let i = 0; i < files.length; i++) {
        formData.append(`imagen-${i}`, files[i]);
        console.log(`imagen - ${i}`, files[i]);
      }


      const url = 'http://localhost/PlantillasWordyPdf/ManejoOrden.php';
      const method = 'POST';

      fetch(url, {
        method: method,
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(text => {
          console.log('Formulario enviado correctamente:', text);
          if (clickedPDF) {
            openVentana();
          } else {
            descargarWORD();
          }
        });

      await createInfo(formData);
      if (mensaje) {
        Swal.fire({
          title: "Completado!",
          text: "Registro Exitosa",
          icon: "success",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const descargarWORD = () => {
    const a = document.createElement('a');
    a.href = 'http://localhost/PlantillasWordyPdf/DescargarWordOrden.php';
    a.download = 'SobrescritoOrden.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openVentana = () => {
    const url = 'http://localhost/PlantillasWordyPdf/ResultadoOrden.pdf';
    const features = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', features);
  };



  return (
    <div className="mx-auto max-w-5xl p-4 text-black shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl text-transform uppercase font-bold text-center text-black">Orden de trabajo de mantenimiento a mobiliario e instalaciones</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-base font-medium mb-1">No. de folio Interno:</label>
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
            <div>
              <label className="block text-base font-medium mb-1">No. de folio Externo:</label>
              <input
                type="number"
                id="folioExterno"
                placeholder="Ingrese el folio Externo"
                name="folioExterno"
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...register("folioExterno", { required: true })}
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
          <SubiendoImagenes ref={subiendoImagenesRef} />
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
              fieldsToCheck={['soliInsumosDescripcion']}
              inputProps={{
                type: "text",
                maxLength: 200,
                className: "w-full text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
              }}
            />
            <input name="descripcion" id="descripcion" type="hidden" value={descripcion} />
          </div>
          <div className="botones">
            <button type="button" onClick={handleToggleModal}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md border border-black"
            >
              Guardar cambios
            </button>
          </div>
        </div>
        <div>
          {isOpen && (
            <div
              id="static-modal"
              tabIndex="-1"
              aria-hidden={!isOpen}
              className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
            >
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Haga click en el tipo de archivo que desea generar:</h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={handleCloseModal}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 p-4 md:grid-cols-2 gap-6 ">
                    <div className="flex items-center justify-center">
                      <button type="submit" style={{ all: 'unset', cursor: 'pointer' }}>
                        <img
                          src={imgWord}
                          style={{ marginLeft: '25px', width: '150px', height: '150px' }}
                          onClick={() => setClickedPDF(false)}
                        />
                      </button>
                    </div>

                    <div>
                      <button type="submit" style={{ all: 'unset', cursor: 'pointer' }}>
                        <img
                          src={imgPDF}
                          onClick={() => setClickedPDF(true)}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
