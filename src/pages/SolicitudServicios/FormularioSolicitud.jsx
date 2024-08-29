import React, { useRef, useState, useEffect } from "react";
import { useSoli } from "../../context/SolicitudContext";
import { useAuth } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import "../../css/Animaciones.css";
import { AutocompleteInput } from "../../components/ui/AutocompleteInput";
import { GridContainer, Label, LlenarSolicitud, Title } from "../../components/ui";
import { ValidacionSoli } from "../../schemas/ValidacionSoli";

export const FormularioSolicitud = () => {

  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState({});

  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const { id } = useParams();

  const editar = new URLSearchParams(location.search).get("editar");
  const duplicar = new URLSearchParams(location.search).get("duplicar");

  const showBackButton = editar || duplicar;
  const titleText = editar ? "Actualizar Solicitud" : "Solicitud de Servicios y Bienes de Consumo Final";

  const [folioInterno, setFolioInterno] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [suministro, setSuministro] = useState("");
  const [pc, setPc] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [actividad, setActividad] = useState("");
  const [selectedActividad, setSelectedActividad] = useState({ id: "", nombre: "" });
  const [justificacion, setJustificacion] = useState("");
  const [items, setItems] = useState([{ cantidad: "", unidad: "", descripcion: "", cantidadAcumulada: 0, cantidadEntregada: 0, NumeroDeEntregas: 0, },]);

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

  const guardarDatos = async (e) => {
    e.preventDefault();
    const fields = { fecha, suministro, pc, proyecto, actividad, justificacion };
    const newErrors = ValidacionSoli(fields, items);
    setErrors(newErrors);

  
    if (Object.keys(newErrors).length === 0) {
      const res = await fetchProyecto();

      // Muestra el Swal y espera a que el usuario presione "OK"
      const result = await Swal.fire({
        title: "Registro Exitoso",
        text: res?.mensaje,
        icon: "success",
        confirmButtonText: "OK"
      });

      // Una vez que el usuario haya presionado "OK", muestra el modal
      if (result.isConfirmed) {
        setIsOpen(true);
      }
    } else {
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
  const toggleModal = () => {
    setIsOpen(!isOpen); 
  };

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
        console.log(unasoli)
        setSolicitudLoaded(true);
      }
    } catch (error) {
      console.error("Error al obtener la solicitud:", error);
    }
  };

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
        getIdsProyectYAct(unasoli.proyecto._id);
        if (unasoli.actividades && unasoli.actividades.length > 0) {
          const primeraActividad = unasoli.actividades[0];
          setActividad(primeraActividad.actividadRef);
          setMyActividad_(primeraActividad.nombreActividad || "");

          setSelectedActividad({ id: primeraActividad.actividadRef, nombre: primeraActividad.nombreActividad })

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

  const actualizarDatos = async () => {
    const fields = { fecha, suministro, pc, proyecto, actividad, justificacion };
    const newErrors = ValidacionSoli(fields, items);
    setErrors(newErrors);

 if (Object.keys(newErrors).length === 0) {
      const res = guardarActualizacion()

      const result = await Swal.fire({
        title: "Registro Exitoso",
        text: res?.mensaje,
        icon: "success",
        confirmButtonText: "OK"
      });

      if (result.isConfirmed) {
        setIsOpen(true);
      }
    } else {
      Swal.fire({
        title: "Alerta!",
        text: "Complete todos los componentes",
        icon: "warning",
        confirmButtonText: "Cool",
      });
      return;
    }
  };

  const datosSolicitud = () => {

    return {
      id, 
      user,
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
    setMyActividad_(selectedActividad.nombre || "");
  };

  const duplicarItem = async (index, e) => {
    e.preventDefault();
    const itemToDuplicate = items[index];
    const duplicatedItem = { ...itemToDuplicate };
    const newItems = [...items, duplicatedItem];
    setItems(newItems);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-black">
      <form  onKeyDown={handleKeyDown}  className="slide-down">
        <div className="bg-white p-6 rounded-md shadow-md">
          <Title showBackButton={showBackButton}>
            {duplicar ? "Solicitud de Servicios y Bienes de Consumo Final" : titleText}
          </Title>
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
              {errors.fecha && <p className="text-red-500">{errors.fecha}</p>}

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
              {errors.suministro && <p className="text-red-500">{errors.suministro}</p>}

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
              {errors.pc && <p className="text-red-500">{errors.pc}</p>}

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
                    {ids
                  .filter((proyecto) => proyecto.actividades && proyecto.actividades.length > 0) // Filtrar proyectos con actividades
                  .map((proyecto) => (
                    <option key={proyecto._id} value={proyecto._id}>
                      {proyecto.nombre}
                    </option>
                  ))}
              </select>
              {errors.proyecto && <p className="text-red-500">{errors.proyecto}</p>}

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
              {errors.actividad && <p className="text-red-500">{errors.actividad}</p>}

            </div>
          </GridContainer>

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
                      {errors[`items[${index}].cantidad`] && <p className="text-red-500">{errors[`items[${index}].cantidad`]}</p>}

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
                      {errors[`items[${index}].unidad`] && <p className="text-red-500">{errors[`items[${index}].unidad`]}</p>}

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
                      {errors[`items[${index}].descripcion`] && <p className="text-red-500">{errors[`items[${index}].descripcion`]}</p>}

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
              {errors.items && <p className="text-red-600 mt-2">{errors.items}</p>}

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
            {errors.justificacion && <p className="text-red-500">{errors.justificacion}</p>}

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
              <div>
                <LlenarSolicitud
                  fecha={fecha || ""}
                  tipoSuministro={suministro || ""}
                  procesoClave={pc || ""}
                  proyecto={myProyecto_ || ""}
                  actividad={myActividad_ || ""}
                  items={items}
                  justificacion={justificacion}
                  solicitante={solicitante}
                  jefeInmediato={jefeInmediato}
                  dirrecion={dirrecion}
                  rectoría={rectoría}
                  closeModal={toggleModal}  
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
