import React, { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSoliSchema } from "../schemas/registerSoliPage";
import { useSoli } from "../context/SolicitudContext";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import "../css/Animaciones.css";

export const RegisterSolicitudPage = () => {
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
  const [folioExterno, setFolioExterno] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [items, setItems] = useState([
    {
      cantidad: "",
      unidad: "",
      descripcion: "",
      cantidadAcumulada: "",
      cantidadEntregada: "",
    },
  ]);

  const [clickedPDF, setClickedPDF] = useState(false);

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const [itemsH, setItemsH] = useState([
    { descripcion: '', historial: ['Historial 1', 'Historial 2'] }
  ]);
  const [showHistorial, setShowHistorial] = useState(null); // Estado para controlar el historial visible

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [fetchActivitiesFlag, setFetchActivitiesFlag] = useState(false);
  const [solicitudLoaded, setSolicitudLoaded] = useState(false);

  const [myProyecto_, setMyProyecto_] = useState("");
  const [myActividad_, setMyActividad_] = useState("");

  const [banderaFirmas, setBanderaFirmas] = useState(false);
  const [solicitante, setSolicitante] = useState('');
  const [jefeInmediato, setJefeInmediato] = useState('');
  const [dirrecion, setDirrecion] = useState('');
  const [rectoría, setRectoría] = useState('');
  const descripcionRefs = useRef([]);

  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct = [], unasoli, traeFolioInterno, myFolioInterno, actializarSoli, getunSolitud, getFirmas, nombresFirmas, } = useSoli();

  const guardarDatos = () => {
    if (
      !fecha ||
      !suministro ||
      !pc ||
      !proyecto ||
      !actividad ||
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

  const handleClickOutside = (event) => {
    if (
      descripcionRefs.current.every((ref, index) => {
        return ref && !ref.contains(event.target);
      })
    ) {
      setShowHistorial(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleHistorial = (index) => {
    setShowHistorial(showHistorial === index ? null : index);
  };

  const fetchProyecto = async () => {
    try {
      const datosSolicitud = {
        folioExterno,
        fecha,
        suministro,
        pc,
        proyecto,
        actividad,
        justificacion,
        items,
      };

      console.log(datosSolicitud);
      crearmySoli(datosSolicitud);
      limpiarDatos();
      localStorage.setItem("datosSolicitud", JSON.stringify(datosSolicitud));

      Swal.fire({
        title: "Completado!",
        text: "Registro Exitosa",
        icon: "success",
        confirmButtonText: "Cool",
      });
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Error al guardar los datos.");
    }
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
  //editar
  useEffect(() => {
    if (editar && unasoli || duplicar && unasoli) {
      console.log(unasoli)

      setFolioInterno(unasoli.folio || "");

      setFecha(
        unasoli.fecha ? new Date(unasoli.fecha).toISOString().slice(0, 10) : ""
      );
      setSuministro(unasoli.tipoSuministro || "");
      setPc(unasoli.procesoClave || "");

      if (unasoli.proyecto) {
        setProyecto(unasoli.proyecto._id || "");
        setMyProyecto_(unasoli.proyecto.nombre || "");

        // Actualiza las actividades cuando se selecciona un proyecto
        getIdsProyectYAct(unasoli.proyecto._id);

        if (unasoli.actividades && unasoli.actividades.length > 0) {
          const primeraActividad = unasoli.actividades[0];

          setActividad(primeraActividad._id || "");
          setMyActividad_(primeraActividad.nombre || "");
          console.log(myActividad_);
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
  }, [banderaFirmas, getFirmas]);

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
      setFolioExterno("");
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
      !actividad ||
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

    const datosSolicitud = {
      id,
      folioExterno,
      fecha,
      suministro,
      pc,
      proyecto,
      actividad,
      justificacion,
      items: items,
    };

    console.log(datosSolicitud)
    actializarSoli(id, datosSolicitud);

    Swal.fire({
      title: "Completado!",
      text: "Actualización Exitosa",
      icon: "success",
      confirmButtonText: "Cool",
    });
  };

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
    console.log(selectedActividad ? selectedActividad.nombre : "");
    setMyActividad_(selectedActividad ? selectedActividad.nombre : "");

  };

  const duplicarItem = async (index, e) => {
    e.preventDefault();
    const itemToDuplicate = items[index];
    const duplicatedItem = { ...itemToDuplicate }; // Crear una copia profunda del objeto
    const newItems = [...items, duplicatedItem];
    setItems(newItems);
  };

  const openVentana = () => {
    const url = 'http://localhost/PlantillasWordyPdf/formResult.pdf';
    const features = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', features);
  };

  const subirDatos = (event) => {
    event.preventDefault(); // Previene el envío predeterminado del formulario
    setIsOpen(false);
    const form = event.target;

    const formData = new FormData(form);
    const url = 'http://localhost/PlantillasWordyPdf/formSoli.php';
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
    <div className="mx-auto max-w-5xl p-4 text-black">
      <form onSubmit={subirDatos}>
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-black">{editar ? "Actualizar Solicitud" : "Solicitud de Servicios y Bienes de Consumo Final"}</h2>
          </div>
          <div>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">No. de folio:</label>
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
                <label htmlFor="fecha" className="block text-sm font-medium mb-1">
                  Selecciona la fecha:
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Tipo de Suministro:
                </label>
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
            </div>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Proceso Clave (PC):
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Proyecto:
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Actividad:
                </label>
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
                  {idsAct.map((actividad) => (
                    <option key={actividad._id} value={actividad._id}>
                      {actividad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <input type="hidden" id="myProyectoInput" name="myProyecto" value={myProyecto_ || ""} />
            <input type="hidden" id="myActividadInput" name="myActividad" value={myActividad_ || ""} />
          </div>

          <div className="text-black">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-6 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Cantidad:</label>
                  <input
                    type="number"
                    id={`items[${index}][cantidad]`}
                    name={`items[${index}][cantidad]`}
                    required
                    placeholder="Ingrese una cantidad"
                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={item.cantidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].cantidad = e.target.value;
                      setItems(newItems);
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Unidad de medida:</label>
                  <select
                    id={`items[${index}][unidad]`}
                    name={`items[${index}][unidad]`}
                    required
                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={item.unidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].unidad = e.target.value;
                      setItems(newItems);
                    }}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </div>
                <div className="col-span-6">
                  <label className="block text-sm font-medium mb-1">Descripción del bien solicitado:</label>
                  <textarea
                    name={`items[${index}][descripcion]`}
                    className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                    placeholder="Ingrese la descripción"
                    required
                    value={item.descripcion || ""}
                    ref={(el) => (descripcionRefs.current[index] = el)}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].descripcion = e.target.value;
                      setItems(newItems);
                    }}
                    onClick={() => toggleHistorial(index)}

                  />
                  {showHistorial === index && (
                    <div
                      className="absolute z-10 bg-white p-3 rounded-md border border-gray-300 shadow-lg mt-2 max-h-40 overflow-y-auto"
                      style={{ width: descripcionRefs.current[index]?.offsetWidth }}
                    >
                      {item.historial && item.historial.length > 0 ? (
                        item.historial.map((hist, histIndex) => (
                          <div key={histIndex} className="mb-2">
                            <span
                              className="text-sm cursor-pointer"
                              onClick={() => {
                                const newItems = [...itemsH];
                                newItems[index].descripcion = hist;
                                setItemsH(newItems);
                                setShowHistorial(null);
                              }}
                            >
                              {hist}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No hay historial disponible.</div>
                      )}
                    </div>
                  )}
                </div>


                <div className="col-span-1 flex justify-center">
                  <label className="block text-sm font-medium mb-1">Acciones:</label>
                  <div className="flex space-x-5">
                    <button className="text-red-500 hover:text-red-700" onClick={(e) => eliminarItem(index, e)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700" onClick={(e) => duplicarItem(index, e)}>
                      <FontAwesomeIcon icon={faClone} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
              onClick={agregarItem}
            >
              Agregar Item
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Justificación para la adquisición:</label>
            <textarea
              name="justificacion"
              required
              className="w-full p-3 resize-none border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              id="justificacion"
              value={justificacion || ""}
              onChange={(e) => setJustificacion(e.target.value)}
            />
          </div>

          <div>
            <div className="tablafirmas flex justify-between mt-5 text-black">
              <div className="columna w-1/4 text-center">
                <label className="block text-sm font-medium mb-1">Solicitud</label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="solicitud"
                  name="solicitud_disabled"
                  required
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value)}
                  disabled
                />
                <input type="hidden" name="solicitud" value={solicitante} />
              </div>
              <div className="columna w-1/4 text-center">
                <label className="block text-sm font-medium mb-1">Revisión</label>
                <label className="block text-sm font-medium mb-1">Jefe Inmediato:</label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="JefeInmediato"
                  name="JefeInmediato_disabled"
                  required
                  value={jefeInmediato}
                  onChange={(e) => setJefeInmediato(e.target.value)}
                  disabled
                />
                <input type="hidden" name="JefeInmediato" value={jefeInmediato} />
              </div>
              <div className="columna w-1/4 text-center">
                <label className="block text-sm font-medium mb-1">Validación:</label>
                <label className="block text-sm font-medium mb-1">Dirección de Admón. y Finanzas:</label>
                <textarea
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  id="Validacion"
                  name="Validacion_disabled"
                  required
                  value={dirrecion}
                  onChange={(e) => setDirrecion(e.target.value)}
                  disabled
                />
                <input type="hidden" name="Validacion" value={dirrecion} />
              </div>
              <div className="columna w-1/4 text-center">
                <label className="block text-sm font-medium mb-1">Autorizó</label>
                <label className="block text-sm font-medium mb-1">Rectoría:</label>
                <textarea
                  id="Autorizo"
                  name="Autorizo_disabled"
                  required
                  className="text-black text-center cursor-not-allowed w-full rounded-md resize-none"
                  value={rectoría}
                  onChange={(e) => setRectoría(e.target.value)}
                  disabled
                />
                <input type="hidden" name="Autorizo" value={rectoría} />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                type="button"
                onClick={editar ? actualizarDatos : guardarDatos}
              >
                {editar ? "Actualizar" : "Guardar cambios"}
              </button>
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
                          <button type="submit" onClick={() => setClickedPDF(false)}
                            style={{ all: 'unset', cursor: 'pointer' }}>
                            <img
                              src="https://static.android.com.pl/uploads/2021/06/microsoft-word-5963679_1280.png"
                              style={{ marginLeft: '25px', width: '150px', height: '150px' }}
                              onClick={fetchProyecto}
                            />
                          </button>
                        </div>

                        <div>
                          <button type="submit" onClick={() => setClickedPDF(true)}
                            style={{ all: 'unset', cursor: 'pointer' }}>
                            <img
                              src="https://static.vecteezy.com/system/resources/previews/023/234/824/original/pdf-icon-red-and-white-color-for-free-png.png"
                              style={{ width: '200px', height: '200px' }}
                              onClick={fetchProyecto}
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
        </div>
      </form>
    </div>
  );
};
