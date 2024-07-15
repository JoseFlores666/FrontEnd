import React, { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSoliSchema } from "../schemas/registerSoliPage";
import { useSoli } from "../context/SolicitudContext";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';

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

  const formRef = useRef(null);

  const { id } = useParams();
  // const searchParams = new URLSearchParams(location.search);

  // const editar = searchParams.get("editar") === "true";
  const editar = new URLSearchParams(location.search).get("editar");
  const duplicar = new URLSearchParams(location.search).get("duplicar");
  // const duplicar = searchParams.get("duplicar") === "true";

  console.log(id)
  // console.log(editar)
  console.log(duplicar)

  const [folioInterno, setFolioInterno] = useState("");
  const [folioExterno, setFolioExterno] = useState("");

  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState(""); //
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

  const { crearmySoli, getIdsProyect, ids, getIdsProyectYAct, idsAct = [], unasoli, unProyectAct, traeFolioInterno, myFolioInterno, actializarSoli, getunSolitud,
    getFirmas,
    nombresFirmas,
  } = useSoli();

  const [datos, setDatos] = useState({
    fecha: "",
    suministro: "",
    pc: "",
    proyecto: "",
    actividad: "",
    justificacion: "",
    items: [],
  });
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
    fetchProyecto();
    openGoogle();
  };

  useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosSolicitud"));
    if (datosGuardados) {
      setDatos(datosGuardados);
    }
  }, []);

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
      setProyecto(unasoli.proyecto || "");
      setActividad(unasoli.actividades || "");
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

      getIdsProyectYAct(unasoli.proyecto);
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
    if (!editar || !duplicar) {
      setFolioInterno(myFolioInterno)
    }
  }, [editar, unasoli, duplicar, nombresFirmas]);

  //editar
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
          console.log(editar)
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

  const openGoogle = () => {
    const url = 'http://localhost/PlantillasWordyPdf/formResult.pdf';
    const features = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
    window.open(url, '_blank', features);
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

    openGoogle();
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
    setFetchPDFFlag(true);
  };

  const duplicarItem = async (index, e) => {
    e.preventDefault();
    const itemToDuplicate = items[index];
    const duplicatedItem = { ...itemToDuplicate }; // Crear una copia profunda del objeto
    const newItems = [...items, duplicatedItem];
    setItems(newItems);
  };


  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form target="_blank" method="post" action="http://localhost/PlantillasWordyPdf/formSoli.php">
        <div className="bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">{editar ? "Actualizar Solicitud" : "Solicitud de Servicios y Bienes de Consumo Final"}</h2>
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
              <div key={index} className="grid grid-cols-3 md:grid-cols-4 gap-6 mb-4">
                <div className="">
                  <label className="block text-sm font-medium mb-1">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    íd={`items[${index}][cantidad]`}
                    name={`items[${index}][cantidad]`}
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
                <div className="">
                  <label className="block text-sm font-medium mb-1">
                    Unidad de medida:
                  </label>
                  <select
                    id={`items[${index}][unidad]`}
                    name={`items[${index}][unidad]`}
                    className="w-full p-3 border border-gray-400 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={item.unidad || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].unidad = e.target.value;
                      setItems(newItems);
                    }}
                  >
                    <option value="">Unidad</option>
                    <option value="Paquete">Paquete</option>
                    <option value="Rollo">Rollo</option>
                    <option value="Caja">Caja</option>
                  </select>
                </div>
                <div className="">
                  <label className="block text-sm font-medium mb-1">
                    Descripción del bien solicitado:
                  </label>
                  <textarea
                    name={`items[${index}][descripcion]`}
                    className="p-3 text-black w-full rounded-md resize-none border border-gray-400"
                    placeholder="Ingrese la descripción"
                    value={item.descripcion || ""}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].descripcion = e.target.value;
                      setItems(newItems);
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <label className="block text-sm font-medium mb-1" >Acciones:</label>
                  <div className="flex justify-center space-x-5">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => eliminarItem(index, e)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => duplicarItem(index, e)}
                    >
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt px-6 py-3 rounded-md border border-black"
                type="submit"
                onClick={editar ? actualizarDatos : guardarDatos}
              >
                {editar ? "Actualizar" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
