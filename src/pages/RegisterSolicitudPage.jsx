import React, { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSoliSchema } from "../schemas/registerSoliPage";
import { useSoli } from "../context/SolicitudContext";
import { useAuth } from "../context/authContext";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import imgPDF from '../img/imagenPDF.png';
import imgWord from '../img/imagenWord.png';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import "../css/Animaciones.css";
import { AutocompleteInput } from "../components/ui/AutocompleteInput";
import { GridContainer, Label, Title } from "../components/ui";

export const RegisterSolicitudPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSoliSchema), });

  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const { id } = useParams();

  const editar = new URLSearchParams(location.search).get("editar");
  const duplicar = new URLSearchParams(location.search).get("duplicar");

  const [folioInterno, setFolioInterno] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState("");
  const [selectedActividad, setSelectedActividad] = useState({ id: "", nombre: "" });
  const [justificacion, setJustificacion] = useState("");
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "", cantidadAcumulada: 0, cantidadEntregada: 0, NumeroDeEntregas: 0, },]);

  const [clickedPDF, setClickedPDF] = useState(false);

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [fetchActivitiesFlag, setFetchActivitiesFlag] = useState(false);
  const [solicitudLoaded, setSolicitudLoaded] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState([]);

  const [myProyecto_, setMyProyecto_] = useState("");
  const [myActividad_, setMyActividad_] = useState("");

  const [banderaFirmas, setBanderaFirmas] = useState(false);
  const [solicitante, setSolicitante] = useState('');
  const [jefeInmediato, setJefeInmediato] = useState('');
  const [dirrecion, setDirrecion] = useState('');
  const [rectoría, setRectoría] = useState('');
  const refs = useRef([]);

  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct = [], unasoli, traeFolioInterno, myFolioInterno, actializarSoli, getunSolitud, getFirmas, nombresFirmas, } = useSoli();
  const { traeHistorialSoli, historialSoli, } = useSoli();
  const { user } = useAuth();

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const guardarDatos = () => {
    if (
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !selectedActividad ||
      !justificacion ||
      items.length === 0 ||
      items.some((item) => !item.unidad || !item.cantidad || !item.descripcion)
    ) {
      Swal.fire({
        title: "Alerta!",
        text: "Complete todos los componentes",
        icon: "warning",
        confirmButtonText: "Cool",
      });
      return;
    }
    setIsOpen(true);
  }

  const fetchProyecto = async () => {
    try {
      const datosSolicitud = {
        fecha,
        suministro,
        pc,
        proyecto,
        selectedActividad,
        justificacion,
        items, user
      };

      console.log(datosSolicitud);
      const res = crearmySoli(datosSolicitud);

      Swal.fire("Registro Exitoso", res.data?.mensaje, "success");
        limpiarDatos();

      localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));

    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Error al guardar los datos.");
    }
  };

  const handleInputChange = (index, value, field) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const fetchSolicitud = async (id) => {
    try {
      if (id) {
        await getunSolitud(id);
        setSolicitudLoaded(true);
      }
    } catch (error) {
      console.error("Error al obtener la solicitud:", error);
    }
  };

  useEffect(() => {
    if (editar && unasoli || duplicar && unasoli) {

      setFolioInterno(unasoli.folio || "");

      setFecha(
        unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : ""
      );
      setSuministro(unasoli.tipoSuministro || "");
      setPc(unasoli.procesoClave || "");

      if (unasoli.proyecto) {
        setProyecto(unasoli.proyecto._id || "");
        setMyProyecto_(unasoli.proyecto.nombre || "");

        getIdsProyectYAct(unasoli.proyecto._id);

       
        if (unasoli.actividades && unasoli.actividades.length > 0) {
          const primeraActividad = unasoli.actividades[0];
<<<<<<< HEAD
          console.log(primeraActividad.actividadRef)
=======

          setActividad(primeraActividad.actividadRef || "");
          setMyActividad_(primeraActividad.nombre || "");
          console.log(myActividad_);
>>>>>>> 31d450e6f8a3e49a6bc3b5d46695f5a6552758ad
          setActividad(primeraActividad.actividadRef || "");
          setMyActividad_(primeraActividad.nombreActividadPropio || "");
        }
      }
      setJustificacion(unasoli.justificacionAdquisicion || "");
      setItems(
        unasoli.suministros || [
          {
            cantidad: "",
            unidad: "",
            descripcion: "",
          },
        ]
      );
    }
  }, [editar, duplicar, unasoli]);

  useEffect(() => {
    if (nombresFirmas.length > 0) {
      const { solicitud, revision, validacion, autorizacion } = nombresFirmas[0];
      setSolicitante(solicitud);
      setJefeInmediato(revision);
      setDirrecion(validacion);
      setRectoría(autorizacion);
    }
    if (!editar) {
      setFolioInterno(myFolioInterno)
    }
  }, [editar, unasoli, duplicar, nombresFirmas]);

  useEffect(() => {
    if (id && editar === "true" && !solicitudLoaded || id && duplicar && !solicitudLoaded) {
      fetchSolicitud(id);
    } else {

    }
  }, [id, editar, duplicar, solicitudLoaded]);

  const agregarItem = (e) => {
    e.preventDefault();
    if (items.length < 10) {
      setItems([...items, { cantidad: "", unidad: "", descripcion: "" }]);
    } else {
      alert("No se pueden agregar más de 10 items.");
    }
  };

  const eliminarItem = (index, e) => {
    e.preventDefault();
    setItems(items.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await getIdsProyectYAct(proyecto);
        console.log(idsAct)
        setFetchActivitiesFlag(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    if (fetchActivitiesFlag) {
      fetchActivities();
    }
  }, [fetchActivitiesFlag, proyecto, getIdsProyectYAct]);

  useEffect(() => {
    const llenaFirmas = async () => {
      try {
        await getFirmas()
        await traeHistorialSoli()
        if (!editar) {
          await traeFolioInterno()
        }
        setBanderaFirmas(true);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    if (!banderaFirmas) {
      llenaFirmas();
    }
  }, [banderaFirmas, getFirmas, traeFolioInterno]);

  useEffect(() => {
    const llenarFormularioActualizar = async () => {
      if (!projectsLoaded) {
        try {
          await getIdsProyect();
          setProjectsLoaded(true);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      }
    };
    llenarFormularioActualizar();
  }, [projectsLoaded, getIdsProyect]);

  const limpiarDatos = () => {
    setTimeout(() => {
      setFecha(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setSuministro("");
      setPc("");
      setActividad("");
      setProyecto("");
      setJustificacion("");
      setItems("");
      setItems([
        {
          cantidad: "",
          unidad: "",
          descripcion: "",
        },
      ]);
      setBanderaFirmas("")
      setSolicitante("")
      setJefeInmediato("")
      setDirrecion("")
      setRectoría("")

    }, 3000);
  };

  const actualizarDatos = () => {
    if (
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !selectedActividad ||
      !justificacion ||
      items.length === 0 ||
      items.some((item) => !item.unidad || !item.cantidad || !item.descripcion)
    ) {
      Swal.fire({
        title: "Alerta!",
        text: "Complete todos los componentes",
        icon: "warning",
        confirmButtonText: "Cool",
      });
      return;
    }
    setIsOpen(true);
  };

  const datosSolicitud = () => {

    return {
      id, user,
      fecha,
      suministro,
      pc,
      proyecto,
      selectedActividad,
      justificacion,
      items,
    };
  };

  const guardarActualizacion = () => {
    const solicitud = datosSolicitud();
    console.log(solicitud)
    actializarSoli(id, solicitud);

    Swal.fire({
      title: "Completado!",
      text: "Actualización Exitosa",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

  useEffect(() => {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (editar) {
        img.onclick = guardarActualizacion;
      } else {
        img.onclick = fetchProyecto;
      }
    });
  }, [editar, duplicar]);

  const handleProyectoChange = (e) => {
    const selectedProyectoId = e.target.value;
    setProyecto(selectedProyectoId);

    const selectedProyecto = ids.find(
      (proyecto) => proyecto._id === selectedProyectoId
    );
    console.log(selectedProyecto ? selectedProyecto.nombre : "");
    setMyProyecto_(selectedProyecto ? selectedProyecto.nombre : "");
    setFetchActivitiesFlag(true);
  };

  const handleChangeActividad = (e) => {
    const selectedActividadId = e.target.value;
    setActividad(selectedActividadId);

    const selectedActividad = idsAct.find(
      (actividad) => actividad._id === selectedActividadId
    );

    setSelectedActividad({
      id: selectedActividad ? selectedActividad._id : "",
      nombre: selectedActividad ? selectedActividad.nombre : ""
    });
    setMyActividad_(selectedActividad ? selectedActividad.nombre : "");
    setMyProyecto_(selectedActividad ? selectedActividad.nombre : "");
  };

  const duplicarItem = async (index, e) => {
    e.preventDefault();
    const itemToDuplicate = items[index];
    const duplicatedItem = { ...itemToDuplicate };
    const newItems = [...items, duplicatedItem];
    setItems(newItems);
  };

  const openVentana = () => {
    const url = 'http://localhost/PlantillasWordyPdf/ResultadoSoli.pdf';
    const features = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', features);
  };

  const subirDatos = (event) => {
    event.preventDefault();
    setIsOpen(false);
    navigate('/soli');
    const form = event.target;

    const formData = new FormData(form);
    const url = 'http://localhost/PlantillasWordyPdf/ManejoSolicitud.php';
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
  };

  const descargarWORD = () => {
    const a = document.createElement('a');
    a.href = 'http://localhost/PlantillasWordyPdf/DescargarWordSoli.php';
    a.download = 'formSolicitud.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form onSubmit={subirDatos} className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title>{editar ? "Actualizar Solicitud" : "Solicitud de Servicios y Bienes de Consumo Final"}</Title>
          <GridContainer>
            <div>
              <Label>No. de folio:</Label>
              <input
                type="text"
                id="folio"
                name="folio"
                disabled
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={folioInterno || ""}
                onChange={(e) => setFolioInterno(e.target.value)}
              />
            </div>
            <div>
              <Label>Selecciona la fecha:</Label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                required
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={fecha || ""}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo de Suministro:</Label>
              <select
                id="suministro"
                name="suministro"
                required
                value={suministro || ""}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setSuministro(e.target.value)}
              >
                <option value="">Seleccione un suministro</option>
                <option value="Normal">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
          </GridContainer>
          <GridContainer>
            <div>
              <Label>Proceso Clave (PC):</Label>
              <select
                id="PC"
                name="pc"
                required
                value={pc || ""}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPc(e.target.value)}
              >
                <option value="">Seleccione el PC</option>
                <option value="Educativo">PC Educativo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <Label>Proyecto:</Label>
              <select
                id="proyecto"
                name="proyecto"
                required
                value={proyecto || ""}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  {
                    setProyecto(e.target.value);
                    handleProyectoChange(e);
                  }
                  setFetchActivitiesFlag(true);
                }}
              >
                <option value="">Seleccione el Proyecto</option>
                {ids.map((proyecto) => (
                  <option key={proyecto._id} value={proyecto._id}>
                    {proyecto.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Actividad:</Label>
              <select
                id="actividad"
                required
                name="actividad"
                value={actividad || ""}
                className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  {
                    setActividad(e.target.value);
                    handleChangeActividad(e);
                  }
                }}
              >
                <option value="">Seleccione una Actividad</option>
                {idsAct.length > 0 && idsAct.map((actividad) => (
                  <option key={actividad._id} value={actividad._id}>
                    {actividad.nombre}
                  </option>
                ))}
              </select>
            </div>
          </GridContainer>
          <input type="hidden" id="myProyectoInput" name="myProyecto" value={myProyecto_ || ""} />
          <input type="hidden" id="myActividadInput" name="myActividad" value={myActividad_ || ""} />
          <div className="relative w-full">
            <table className="w-full caption-bottom text-sm border">
              <thead className="[&_tr]:border border-gray-400">
                <tr className="border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                  <th className="h-10 text-center px-4 align-middle font-bold text-black border border-gray-400">Cantidad</th>
                  <th className="h-10 text-center px-4 align-middle font-bold text-black border border-gray-400">Unidad de medida</th>
                  <th className="h-10 px-4 text-center align-middle font-bold text-black border border-gray-400">Descripción del bien solicitado</th>
                  <th className="h-10 px-4 align-middle font-bold text-black border border-gray-400">Acción</th>
                </tr>
              </thead>
              <tbody className="border border-gray-400">
                {items.map((item, index) => (
                  <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-gray-400">
                    <td className="p-2 align-middle border border-gray-400">
                      <div className="flex justify-center">
                        <input
                          className="h-10 w-full text-center rounded-md border border-input px-3 py-2 border-gray-400 bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                          type="number"
                          placeholder="Ingrese la cantidad"
                          maxLength="200"
                          min={0}
                          value={item.cantidad || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].cantidad = e.target.value;
                            setItems(newItems);
                          }}
                          name={`items[${index}][cantidad]`}
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle border border-gray-400">
                      <select
                        className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={item.unidad || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].unidad = e.target.value;
                          setItems(newItems);
                        }}
                        name={`items[${index}][unidad]`}
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="Paquete">Paquete</option>
                        <option value="Rollo">Rollo</option>
                        <option value="Kit">Kit</option>
                        <option value="Caja">Caja</option>
                        <option value="Pieza">Pieza</option>
                      </select>
                    </td>
                    <td className="p-1 align-middle border border-gray-400">
                      <AutocompleteInput
                        index={index}
                        value={item.descripcion}
                        onChange={(value) => handleInputChange(index, value, "descripcion")}
                        data={historialSoli}
                        recentSuggestions={recentSuggestions}
                        setRecentSuggestions={setRecentSuggestions}
                        inputRefs={refs}
                        placeholder="Ingrese una descripción"
                        fieldsToCheck={['suministros',
                        ]}
                        inputProps={{
                          type: "text",
                          maxLength: 500,
                          name: `items[${index}][descripcion]`,
                          className: "w-full resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                          onBlur: () => setValue(`items[${index}].descripcion`, item.descripcion, { shouldValidate: true })
                        }}
                      />
                    </td>
                    <td className="border border-gray-400">
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={(e) => eliminarItem(index, e)}
                          className=" text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        <button className="text-blue-500 hover:text-blue-700" onClick={(e) => duplicarItem(index, e)}>
                          <FontAwesomeIcon icon={faClone} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-white border-b border-r border-l border-gray-400 rounded-b-md">
              <button
                onClick={(e) => agregarItem(e)}
                className="px-4 py-2 text-white font-bold border bg-green-500 border-black rounded-md hover:bg-green-700 w-full">
                Agregar más
              </button>
            </div>
          </div>

          <div className="mb-6 mt-5">
            <Label>Justificación para la adquisición:</Label>
            <AutocompleteInput
              index={items.length}
              value={justificacion}
              onChange={(value) => setJustificacion(value)}
              data={historialSoli}
              recentSuggestions={recentSuggestions}
              setRecentSuggestions={setRecentSuggestions}
              inputRefs={refs}
              placeholder="Ingrese la justificacion"
              fieldsToCheck={['areaSolicitante', 'soliInsumosDescripcion', 'justificacionAdquisicion']}
              inputProps={{
                type: "text",
                maxLength: 500,
                name: `justificacion`,
                className: "w-full resize-none text-black p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                onBlur: () => setValue(`justificacion`, justificacion, { shouldValidate: true })
              }}
            />
          </div>

          <div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <Label>Solicitud</Label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="solicitud"
                  name="solicitud"
                  required
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  disabled
                />
                <input type="hidden" name="solicitud" value={solicitante} />
              </div>
              <div>
                <Label>Revisión <br />Jefe Inmediato:</Label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="JefeInmediato"
                  name="JefeInmediato"
                  required
                  value={jefeInmediato}
                  onChange={(e) => setJefeInmediato(e.target.value)}
                  disabled
                />
                <input type="hidden" name="JefeInmediato" value={jefeInmediato} />
              </div>
              <div>
                <Label>Validación <br />Dirección de Admón. y Finanzas:</Label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="Validacion"
                  name="Validacion"
                  required
                  value={dirrecion}
                  onChange={(e) => setDirrecion(e.target.value)}
                  disabled
                />
                <input type="hidden" name="Validacion" value={dirrecion} />
              </div>
              <div>
                <Label>Autorizó <br />Rectoría:</Label>
                <textarea
                  id="Autorizo"
                  name="Autorizo"
                  required
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  value={rectoría}
                  onChange={(e) => setRectoría(e.target.value)}
                  disabled
                />
                <input type="hidden" name="Autorizo" value={rectoría} />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                type="button"
                onClick={editar ? actualizarDatos : guardarDatos}
              >
                {editar ? "Actualizar" : "Guardar cambios"}
              </button>
            </div>

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
                          <button type="submit" onClick={() => setClickedPDF(false)}
                            style={{ all: 'unset', cursor: 'pointer' }}>
                            <img
                              src={imgWord}
                              style={{ marginLeft: '25px', width: '150px', height: '150px' }}
                              onClick={editar ? guardarActualizacion : fetchProyecto}
                            />
                          </button>
                        </div>

                        <div>
                          <button type="submit" onClick={() => setClickedPDF(true)}
                            style={{ all: 'unset', cursor: 'pointer' }}>
                            <img
                              src={imgPDF}
                              style={{ width: '200px', height: '200px' }}
                              onClick={editar ? guardarActualizacion : fetchProyecto}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </form>
    </div>
  );
};